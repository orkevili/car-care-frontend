import { useLocation } from "wouter";
import apiClient, { ServiceAPI, VehicleAPI } from "./Api";
import Container from "./Container";
import StyledButton from "./StyledButton";
import Title from "./Title";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { navigate } from "wouter/use-browser-location";
import Loader from "./Loading";


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


const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
`;

const ModalContent = styled.div`
    margin-left: 18%;
    background: linear-gradient(135deg, rgba(20, 20, 20, 1), rgba(47, 116, 109, 0.8));
    padding: 2rem;
    border-radius: 12px;
    border: 2px solid rgba(10, 230, 230, 1);
    width: 90%;
    max-width: 400px;
    box-shadow: 0 0 20px rgba(10, 230, 230, 0.5);
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ModalTitle = styled.h2`
    color: white;
    text-align: center;
    font-family: "Orbitron", sans-serif;
    margin-bottom: 1rem;
    font-size: 1.2rem;
`;

const ModalInput = styled.input`
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(10, 230, 230, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-family: inherit;
    &:focus {
        outline: none;
        border-color: rgba(10, 230, 230, 1);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
`;

const CancelButton = styled(StyledButton)`
    background-color: transparent;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    &:hover {
        background-color: rgba(255, 107, 107, 0.1);
        box-shadow: none;
    }
`;

const ActionModalContent = styled(ModalContent)`
    max-width: 300px;
    padding: 1.5rem;
    gap: 0.8rem;
`;

const ActionButton = styled(StyledButton)`
    width: 100%;
    margin: 0;
    padding: 0.75rem 0;
    font-size: 1rem;
`;

const DeleteButton = styled(ActionButton)`
    background-color: transparent;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    &:hover {
        background-color: rgba(255, 107, 107, 0.1);
        box-shadow: none;
    }
`;


function Garage() {
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
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
    const [, setLocation] = useLocation();

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
            console.error("Hiba:", error);
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
            alert("Márka, modell és év megadása kötelező!")
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
            alert("Hiba történt a mentés során!");
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
        if (!window.confirm(`Biztosan törölni szeretnéd a(z) ${formData.brand} ${formData.model} nevű járművet?`)) {
            return;
        }

        try {
            await VehicleAPI.delete(formData.id);
            fetchVehicles(); 
            setShowActionModal(false);
            resetForm();
        } catch (error) {
            alert("Hiba történt a jármű törlése során.");
            console.error(error);
        }
    };
    
    return (
        <Container>
            <Title>My garage</Title>
            <StyledButton onClick={handleAddNew}>Add new</StyledButton>       
            {loading ? (
                <Loader />
            ) : (
                <CardsPage>
                    {Array.isArray(vehicles) && vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <Card key={vehicle.id} onClick={() => handleCardClick(vehicle)}>
                                <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                                <Description>Évjárat:<br/>{vehicle.year}</Description>
                                <Description>Üzemanyag: <br/>{vehicle.fuel}</Description>
                            </Card>
                        ))
                    ) : (
                        <p style={{color: 'white'}}>Még nincs járműved.</p>
                    )}
                </CardsPage>
            )}
            {showEditModal && (
                <ModalOverlay onClick={() => setShowEditModal(false)}> 
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>{formData.id ? 'Jármű módosítása' : 'Új jármű hozzáadása'}</ModalTitle>
                        <ModalInput 
                            type="text" 
                            name="brand" 
                            placeholder="Márka (pl. VW)" 
                            value={formData.brand}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="text" 
                            name="model" 
                            placeholder="Modell (pl. Golf)" 
                            value={formData.model}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="number" 
                            name="year" 
                            placeholder="Évjárat" 
                            value={formData.year}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="text" 
                            name="fuel" 
                            placeholder="Üzemanyag (pl. Dízel)" 
                            value={formData.fuel}
                            onChange={handleInputChange}
                        />

                        <ButtonGroup>
                            <CancelButton onClick={() => { setShowEditModal(false); resetForm(); }}>Mégse</CancelButton>
                            <StyledButton onClick={handleSave}>
                                {formData.id ? 'Módosítás mentése' : 'Létrehozás'}
                            </StyledButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}

            {showActionModal && formData.id && (
                <ModalOverlay onClick={() => setShowActionModal(false)}> 
                    <ActionModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>Műveletek a(z) {formData.brand} járművel</ModalTitle>
                        <ActionButton onClick={handleViewServices}>Szerviztörténet</ActionButton>
                        <ActionButton onClick={handleEdit}>Adatok módosítása</ActionButton>
                        <DeleteButton onClick={handleDelete}>Jármű törlése</DeleteButton>
                        <CancelButton onClick={() => { setShowActionModal(false); resetForm(); }}>Bezárás</CancelButton>
                    </ActionModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}

export default Garage;