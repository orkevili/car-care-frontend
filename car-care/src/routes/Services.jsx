import { useState, useEffect } from "react";
import { ServiceAPI, VehicleAPI } from "../Api"; 
import Container from "../components/Container";
import StyledButton from "../components/StyledButton";
import Title, { SmallTitle } from "../components/Title";
import Loader from "../components/Loading";
import styled from "styled-components";
import { useRoute } from "wouter";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { ActionButton, ButtonGroup, CancelButton, ModalContent, ModalInput, ModalOverlay, ModalTitle } from "../components/Modal";

const Table = styled.table`
    margin: 1rem;
    background-color: rgba(47, 116, 109, 1);
    border-radius: 6px;
    width: 90%;
    & > thead td {
        color: hsla(174, 92%, 71%, 1.00);
        border-bottom: 2px solid rgba(20, 97, 97, 1);
        font-weight: bold;
    }
`;

const Tr = styled.tr`
    height: 3rem;
    &:hover {
        background-color: rgba(9, 139, 126, 0.8);
        box-shadow: 2px 5px 200px black;
    }
`;

const Td = styled.td`
    width: fit-content;
    text-align: center;
    padding: 0.5rem;
    color: white;
`;


function Services() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [vehicleMap, setVehicleMap] = useState({})
    const [match, params] = useRoute("/services/:vehicleId")
    const [showEditModal, setShowEditModal] = useState(false)
    const [vehicleId, setVehicleId] = useState(null)

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        odometer: "",
        date: "",
        cost: "",
        description: "",
        vehicle_id: ""
    })

    
    useEffect(() => {
        setVehicleId(params ? params.vehicleId : null)
    }, [params])
    
    const pageTitle = vehicleId ? <><Title>Service history</Title><SmallTitle>{vehicleMap[vehicleId]}</SmallTitle></>: <Title>All service history</Title>

    const fetchAllData = async () => {
        let serviceResponse;
        try {
            setLoading(true);                
            const vehicleResponse = await VehicleAPI.getAll();
            const rawVehicleData = vehicleResponse.data.Vehicles; 
            const map = {};
            if (rawVehicleData) {
                const vehicleArray = Object.entries(rawVehicleData).map(([key, value]) => ({ id: key, ...value }));
                vehicleArray.forEach(v => {
                    map[v.id] = `${v.brand} ${v.model}`;
                });
            }
            setVehicleMap(map);
            
            if (vehicleId) {
                serviceResponse = await ServiceAPI.getById(vehicleId);
            } else {
                serviceResponse = await ServiceAPI.getAll(); 
            }
            
            const rawServiceData = serviceResponse.data.Services; 
            
            if (rawServiceData) {
                const servicesArray = Object.entries(rawServiceData).map(([key, value]) => ({
                    id: key, 
                    vehicle_id: String(value.vehicle_id), 
                    ...value
                }));
                setServices(servicesArray);
            } else {
                setServices([]);
            }
        } catch (error) {
            console.error("Error requesting data:", error);
            toast.error("Couldn't load the data.")
            setServices([]);
            setVehicleMap({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData()
    }, [vehicleId]); 

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const resetForm = () => {
        setFormData({id: null, name: "", odometer: "", date: "", cost: "", description: "", vehicle_id: ""})
    }

    const handleAddNew = () => {
        resetForm()
        setShowEditModal(true)
    }

    const handleEdit = (serviceData) => {
        const editedData = {
            ...serviceData,
        }
        setFormData(editedData)
        setShowEditModal(true)
    }

    const handleDelete = async (formData) => {
        if (!window.confirm(`Are you sure to delete ${formData.name} service entry?`)) {
            return;
        }
        try {
            await ServiceAPI.delete(formData.id, vehicleId);
            fetchAllData();
            resetForm();
        } catch (error) {
            console.error(error);
                        toast.error(`Error during deleting ${formData.name} service entry.`)
        }
    };
    
    const handleSave = async () => {
        if (!formData.name || !formData.odometer || !formData.date || !formData.cost || !formData.description) {
            toast.warn("Name, odometer, date and cost are required!")
            return
        }
        try {
            if (formData.id) {
                await ServiceAPI.update(formData.id, vehicleId, formData)
            } else {
                await ServiceAPI.create(vehicleId, formData)
            }
            setShowEditModal(false)
            resetForm()
            fetchAllData()
        } catch(error) {
            alert("Error during save.")
            console.error(error)
        }
    }

    const tableHeaders = [
        `${!vehicleId ? "Vehicle" : ""}`, "Service", "Odometer", "Date", "Cost", "Description"
    ];

    return (
        <Container>
            {pageTitle}
            {vehicleId && <StyledButton onClick={handleAddNew}><FiPlus /></StyledButton>}
            {loading ? (
                <Loader />
            ) : (
                <Table>
                    <thead>
                        <Tr>
                            {tableHeaders.map(header => <Td key={header}>{header}</Td>)}
                        </Tr>
                    </thead>
                    <tbody>
                        {services.length > 0 ? (
                            services.map((event) => (
                                <Tr key={event.id}>
                                    {!vehicleId ? <Td>{vehicleMap[event.vehicle_id] || `ID: ${event.vehicle_id}`}</Td> : <Td></Td>}
                                    <Td>{event.name}</Td>
                                    <Td>{event.odometer} km</Td>
                                    <Td>{event.date}</Td>
                                    <Td>{event.cost} HUF</Td>
                                    <Td>{event.description}</Td>
                                    <Td>
                                        <ActionButton onClick={() => handleEdit(event)}><FiEdit /></ActionButton>
                                        <ActionButton onClick={() => handleDelete(event)}><FiTrash /></ActionButton>
                                        </Td>
                                </Tr>
                                
                            ))
                        ) : (
                            <tr>
                                <Td colSpan={tableHeaders.length}>No service data</Td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
            {showEditModal && (
                <ModalOverlay onClick={() => setShowEditModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>{formData.id ? `Edit service` : 'Add new service'}</ModalTitle>
                        <ModalInput
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <ModalInput
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                         <ModalInput
                            type="text"
                            name="date"
                            placeholder="Date"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                        <ModalInput
                            type="number"
                            step={100}
                            name="odometer"
                            placeholder="Odometer"
                            value={formData.odometer}
                            onChange={handleInputChange}
                        />
                        <ModalInput
                            type="number"
                            name="cost"
                            step={1000}
                            placeholder="Cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                        />
                        <ModalInput 
                            type="number"
                            name="vehicle_id"
                            defaultValue={formData.vehicle_id}
                            hidden
                        />
                        <ButtonGroup>
                            <CancelButton onClick={() => { setShowEditModal(false); resetForm() }}>Cancel</CancelButton>
                            <StyledButton onClick={handleSave}>
                                {formData.id ? 'Save changes' : 'Add'}
                            </StyledButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}

export default Services;