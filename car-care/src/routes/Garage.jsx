import { useLocation } from "wouter";
import { VehicleAPI } from "../Api";
import Container from "../components/Container";
import StyledButton from "../components/StyledButton";
import Title from "../components/Title";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Loader from "../components/Loading";
import { ModalContent, ModalInput, ModalOverlay, ModalTitle, DeleteButton, ActionButton, ActionModalContent, CancelButton, ButtonGroup } from "../components/Modal";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";


const Card = styled.div`
    height: 200px;
    width: 200px;
    border-radius: 6px;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
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
    margin: 0.75rem;
    & > span {
        margin-top: 0.2rem;
        color: rgba(6, 255, 201, 1);
    }
`;


function Garage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setLocation] = useLocation();
    const [showEditModal, setShowEditModal] = useState(false); 
    const [showActionModal, setShowActionModal] = useState(false); 
    const [formData, setFormData] = useState({
        id: null,
        make: "",
        model: "",
        plate: "",
        year: "",
        fuel: "",
        purchase_date: "",
        purchase_price: "",
        purchase_odometer: "",
    });

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await VehicleAPI.getAll();

            if (Array.isArray(response.data)) {
                setVehicles(response.data);
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
        if (!formData.make || !formData.model || !formData.year ) {
            toast.warn("Make, model and year are required!")
            return;
        }
        try {
            console.log(formData);
            if (formData.id) {
                await VehicleAPI.update(formData.id, formData);
                toast.success("Vehicle updated!");
            } else {
                await VehicleAPI.create(formData);
                toast.success("Vehicle added!");
            }
            setShowEditModal(false);
            resetForm();
            fetchVehicles();
            
        } catch (error) {
            alert("Error during save.");
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({ id: null, make: "", model: "", plate: "", year: "", fuel: "", purchase_date: "", purchase_price: "", purchase_odometer: ""});
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

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure to delete ${formData.make} ${formData.model} vehicle?`)) {
            return;
        }
        try {
            await VehicleAPI.delete(formData.id);
            fetchVehicles(); 
            setShowActionModal(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(`Error during deleting ${formData.make} ${formData.model} vehicle.`)
        }
    };

    const handleSelectVehicle = () => {
        localStorage.setItem("activeVehicleName", `${formData.make} ${formData.model}`);
        localStorage.setItem("activeVehicleId", formData.id);
        setShowActionModal(false);
        setLocation(`/vehicles/${formData.id}`);
    };
    
    return (
        <Container>
            <Title>Select a vehicle</Title>
            <StyledButton onClick={handleAddNew}><FiPlus /></StyledButton>       
            {loading ? (
                <Loader />
            ) : (
                <CardsPage>
                    {Array.isArray(vehicles) && vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <Card key={vehicle.id} onClick={() => handleCardClick(vehicle)}>
                                <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                                <Description>Year<br/><span>{vehicle.year}</span></Description>
                                <Description>Fuel <br/><span>{vehicle.fuel}</span></Description>
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
                            name="make" 
                            placeholder="Make (Volkswagen)" 
                            value={formData.make}
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
                            type="text"
                            name="plate"
                            placeholder="License plate ASD-123"
                            value={formData.plate}
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
                        <ModalInput 
                            type="date"
                            name="purchase_date"
                            placeholder="Puchase date"
                            value={formData.purchase_date}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="number"
                            name="purchase_price"
                            placeholder="Purchase price"
                            value={formData.purchase_price}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="number"
                            name="purchase_odometer"
                            placeholder="Odometer"
                            value={formData.purchase_odometer}
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
                        <ModalTitle>Operations with the {formData.make}</ModalTitle>
                        <ActionButton onClick={handleSelectVehicle}>Select</ActionButton>
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