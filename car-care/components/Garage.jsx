import { useLocation } from "wouter";
import { VehicleAPI } from "./Api";
import Container from "./Container";
import StyledButton from "./StyledButton";
import Title from "./Title";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Loader from "./Loading";
import { ModalContent, ModalInput, ModalOverlay, ModalTitle, DeleteButton, ActionButton, ActionModalContent, CancelButton, ButtonGroup } from "./Modal";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";


const Card = styled.div`
    padding: 0.6rem;
    height: 170px;
    width: 170px;
    border-radius: 6px;
    background-color: rgba(47, 116, 109, 1);
    border: 2px solid;
    border-color: rgba(10, 230, 230, 1);
    box-shadow: 2px 3px 20px black;
    cursor: pointer; /* FIGYELEM: Hozzáadva a kurzor, jelzi a kattinthatóságot */
    transition: transform 0.1s;
    &:hover {
        transform: scale(1.03);
    }
`;

const CardsPage = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.32rem;
    margin: 1rem;
    flex-wrap: wrap;
`;

const CardTitle = styled.p`
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
`;

const Description = styled.p`
    text-align: center;
    font-size: 0.9rem;
`;


function Garage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setLocation] = useLocation();
    const [showEditModal, setShowEditModal] = useState(false); 
    const [showActionModal, setShowActionModal] = useState(false); 
    const [formData, setFormData] = useState({
        id: null,
        brand: "",
        model: "",
        year: "",
        fuel: "",
        plate: ""
    });

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await VehicleAPI.getAll();
            const rawData = response.data.Vehicles;

            if (rawData) {
                const vehiclesArray = Object.entries(rawData).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setVehicles(vehiclesArray);
            } else {
                setVehicles([]);
            }
        } catch (error) {
            console.error("Error requesting data:", error);
            toast.error("Couldn't load the data.")
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    
    const handleSave = async () => {
        if (!formData.brand || !formData.model || !formData.year ) {
            toast.warning("Make, model and year are required!")
            return;
        }
        try {
            if (formData.id) {
                await VehicleAPI.update(formData.id, formData)
            } else {
                await VehicleAPI.create(formData)
            }
            
            setShowEditModal(false)
            resetForm()
            fetchVehicles()
            
        } catch (error) {
            alert("Error during save.");
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({ id: null, brand: "", model: "", year: "", fuel: ""});
    };
    
    const handleAddNew = () => {
        resetForm(); 
        setShowEditModal(true);
    };

    const handleCardClick = (vehicle) => {
        setFormData(vehicle); 
        setShowActionModal(true);
    };

    const handleEdit = () => {
        setShowActionModal(false);
        setShowEditModal(true);
    };

    const handleViewServices = () => {
        setShowActionModal(false);
        setLocation(`/services/${formData.id}`); 
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure to delete ${formData.brand} ${formData.model} vehicle?`)) {
            return;
        }
        try {
            await VehicleAPI.delete(formData.id);
            fetchVehicles(); 
            setShowActionModal(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(`Error during deleting ${formData.brand} ${formData.model} vehicle.`)
        }
    };
    
    return (
        <Container>
            <Title>My garage</Title>
            <StyledButton onClick={handleAddNew}><FiPlus /></StyledButton>       
            {loading ? (
                <Loader />
            ) : (
                <CardsPage>
                    {Array.isArray(vehicles) && vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <Card key={vehicle.id} onClick={() => handleCardClick(vehicle)}>
                                <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                                <Description>Year<br/>{vehicle.year}</Description>
                                <Description>Fuel <br/>{vehicle.fuel}</Description>
                            </Card>
                        ))
                    ) : (
                        <p style={{color: 'white'}}>You don't have any vehicles, yet.</p>
                    )}
                </CardsPage>
            )}
            {showEditModal && (
                <ModalOverlay onClick={() => setShowEditModal(false)}> 
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>{formData.id ? 'Vehicle edit' : 'Add new vehicle'}</ModalTitle>
                        <ModalInput 
                            type="text" 
                            name="brand" 
                            placeholder="Make (Volkswagen)" 
                            value={formData.brand}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="text" 
                            name="model" 
                            placeholder="Model (Golf 5)" 
                            value={formData.model}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="number" 
                            name="year" 
                            placeholder="Year (2025)" 
                            value={formData.year}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="text" 
                            name="fuel" 
                            placeholder="Fuel (Petrol)" 
                            value={formData.fuel}
                            onChange={handleInputChange}
                        />

                        <ButtonGroup>
                            <CancelButton onClick={() => { setShowEditModal(false); resetForm(); }}>Cancel</CancelButton>
                            <StyledButton onClick={handleSave}>
                                {formData.id ? 'Save changes' : 'Add'}
                            </StyledButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}

            {showActionModal && formData.id && (
                <ModalOverlay onClick={() => setShowActionModal(false)}> 
                    <ActionModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>Operations with the {formData.brand}</ModalTitle>
                        <ActionButton onClick={handleViewServices}>Service history</ActionButton>
                        <ActionButton onClick={handleEdit}>Edit vehicle</ActionButton>
                        <DeleteButton onClick={handleDelete}>Delete vehichle</DeleteButton>
                        <CancelButton onClick={() => { setShowActionModal(false); resetForm(); }}>Close</CancelButton>
                    </ActionModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}

export default Garage;