import { useLocation } from "wouter";
import { VehicleAPI } from "../Api";
import { VehicleContext } from "../components/VehicleContext";
import { Container } from "../components/Container";
import StyledButton from "../components/StyledButton";
import Title from "../components/Title";
import styled from "styled-components";
import { useState, useEffect, useContext, useRef } from "react";
import Loader from "../components/Loading";
import { ModalContent, ModalInput, ModalOverlay, ModalTitle, DeleteButton, ActionButton, ActionModalContent, CancelButton, ButtonGroup } from "../components/Modal";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import defaultCar from '../assets/default-car.png'


const Card = styled.div`
    height: 200px;
    width: 200px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: rgba(47, 116, 109, 1);
    border: 2px solid;
    border-color: rgba(10, 230, 230, 1);
    box-shadow: 2px 3px 20px black;
    cursor: pointer;
    transition: transform 0.1s;
    &:hover {
        transform: scale(1.03);
    }
`;

const CardsPage = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.24rem;
    margin: 1rem;
    flex-wrap: wrap;
`;

const CardTitle = styled.p`
    border-bottom: 2px solid rgba(6, 255, 201, 1);
    border-radius: 7px;
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
`;

const Description = styled.p`
    font-size: 0.9rem;
    margin: 0.12rem;
    & > span {
        margin-top: 0.2rem;
        color: rgba(6, 255, 201, 1);
    }
`;

const BACKEND_URL = "http://localhost:8000";

function Garage() {
    const [, setLocation] = useLocation();
    const [showEditModal, setShowEditModal] = useState(false); 
    const [showActionModal, setShowActionModal] = useState(false); 
    const [formData, setFormData] = useState({
        id: null,
        make: "",
        model: "",
        license_plate: "",
        year: "",
        fuel: "",
        purchase_date: "",
        purchase_price: "",
        purchase_odometer: ""
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const { vehicles, setVehicles, activeVehicle, setActiveVehicle, services, setServices, parts, setParts, loading, fetchVehicles, fetchVehicleData } = useContext(VehicleContext);

    const resetForm = () => {
        setFormData({
            id: null, 
            make: "", 
            model: "", 
            license_plate: "", 
            year: "", 
            fuel: "", 
            purchase_date: "", 
            purchase_price: "", 
            purchase_odometer: "", 
        });
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return defaultCar;
        if (imagePath.startsWith('data:')) return imagePath;
        if (imagePath.startsWith('http')) return imagePath;
        return `${BACKEND_URL}${imagePath}`;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.warn("Image too large(Max 5MB)!");
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {setFormData({...formData, [e.target.name]: e.target.value});};
    
    const handleSave = async () => {
        if (!formData.make || !formData.model || !formData.year ) {
            toast.warn("Make, model and year are required!")
            return;
        }
        try {
            const dataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'id' && formData[key] === null) return;
                if (formData[key] !== null) {
                    dataToSend.append(key, formData[key]);
                }
            });
            if (selectedFile) {
                dataToSend.append('image', selectedFile);
            }
            if (formData.id) {
                await VehicleAPI.update(formData.id, dataToSend);
                toast.success("Vehicle updated!");
            } else {
                await VehicleAPI.create(dataToSend);
                toast.success("Vehicle added!");
            }
            setShowEditModal(false);
            resetForm();
            fetchVehicles();
            
        } catch (error) {
            toast.error(`Error during save, ${error}`)
            console.error(error);
        }
    };
    
    const handleAddNew = () => {
        resetForm(); 
        setShowEditModal(true);
    };

    const handleCardClick = (vehicle) => {
        setFormData(vehicle); 
        setPreviewUrl(vehicle.image);
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
            toast.error(`Error during deleting ${formData.make} ${formData.model} vehicle, ${error}`,)
        }
    };

    const handleSelectVehicle = () => {
        setActiveVehicle({
            "id": formData.id,
            "make": formData.make,
            "model": formData.model,
            "license_plate": formData.license_plate,
            "year": formData.year,
            "fuel": formData.fuel,
            "purchase_date": formData.purchase_date,
            "purchase_price": formData.purchase_price,
            "purchase_odometer": formData.purchase_odometer,
        });
        setShowActionModal(false);
        setLocation(`/services`);
    };
    
    return (
        <Container>
            {loading &&  <Loader />}
            <Title>Select a vehicle</Title>
            <StyledButton onClick={handleAddNew}><FiPlus />Add</StyledButton>       
            <CardsPage>
                {Array.isArray(vehicles) && vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <Card key={vehicle.id} onClick={() => handleCardClick(vehicle)}>
                            <img
                                src={getImageUrl(vehicle.image)}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                /> 
                                <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                            {vehicle.license_plate && <Description>License<br/><span>{vehicle.license_plate}</span></Description>}
                        </Card>
                    ))
                ) : (
                    <p style={{color: 'white'}}>You don't have any vehicles, yet.</p>
                )}
            </CardsPage>
            {showEditModal && (
                <ModalOverlay onClick={() => setShowEditModal(false)}> 
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>{formData.id ? 'Vehicle edit' : 'Add new vehicle'}</ModalTitle>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                            {previewUrl && (
                                <img src={getImageUrl(previewUrl)} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />   
                            )}
                            <ModalInput
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            <StyledButton type="button" onClick={() => fileInputRef.current.click()} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                {formData.image_data ? 'Change Photo' : 'Upload Photo'}
                            </StyledButton>
                        </div>
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
                            name="license_plate"
                            placeholder="License plate ASD-123"
                            value={formData.license_plate}
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
                            defaultValue={new Date()}
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
                        <DeleteButton onClick={handleDelete}>Delete vehicle</DeleteButton>
                        <CancelButton onClick={() => { setShowActionModal(false); resetForm(); }}>Close</CancelButton>
                    </ActionModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}

export default Garage;