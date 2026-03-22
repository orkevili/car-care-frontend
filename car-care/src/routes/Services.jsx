import { useState, useEffect } from "react";
import { ServiceAPI, VehicleAPI } from "../Api"; 
import Container from "../components/Container";
import StyledButton from "../components/StyledButton";
import Title, { SmallTitle } from "../components/Title";
import Loader from "../components/Loading";
import styled from "styled-components";
import { useLocation, useRoute } from "wouter";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { ActionButton, ButtonGroup, CancelButton, ModalContent, ModalInput, ModalOverlay, ModalTitle } from "../components/Modal";

const Table = styled.table`
    background-color: rgba(47, 116, 109, 1);
    border-radius: 6px;
    width: 80%;
    & > thead td {
        margin-top: 10rem;
        color: hsla(174, 92%, 71%, 1.00);
        border-bottom: 2px solid rgba(20, 97, 97, 1);
        font-weight: bold;
    }
    @media (max-width: 900px) {
        & > thead {
            display: none;
        }
        display: block;
        background-color: rgba(47, 116, 109, 1);
        margin-bottom: 1rem;
        border-radius: 8px;
        height: auto;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border: 1px solid rgba(20, 97, 97, 1);

`;

const Tr = styled.tr`
    width: auto;
    height: 3rem;
    &:hover {
        background-color: rgba(9, 139, 126, 0.8);
        box-shadow: 2px 5px 200px black;
    }
    @media (max-width: 900px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(47, 116, 109, 1);
        border-radius: 8px;
        height: auto;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border: 1px solid rgba(20, 97, 97, 1);  
`;

const Td = styled.td`
    width: auto;
    text-align: center;
    color: white;

    @media (max-width: 900px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: right;
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        &:last-child {
            border-bottom: none;
            justify-content: center;
            padding-top: 1rem;
        }
`;


function Services() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const [ , setLocation] = useLocation()
    const [match, params] = useRoute("/vehicles/:vehicleId")
    const vehicleId = params ? params.vehicleId : null;
    const vehicleName = localStorage.getItem("activeVehicleName");

    const [formData, setFormData] = useState({
        id: null,
        title: "",
        odometer: "",
        date: "",
        labor_cost: "",
        description: "",
        vehicle_id: ""
    })
    
    const pageTitle = (
        <>
            <Title>Service History</Title>
            <SmallTitle>{vehicleName}</SmallTitle>
        </>
    )

    const fetchAllData = async () => {
        try {
            setLoading(true);                
            const serviceResponse = await ServiceAPI.getById(vehicleId);
            if (Array.isArray(serviceResponse.data)) {
                setServices(serviceResponse.data);
            } else {
                setServices([]);
            }
            
        } catch (error) {
            console.error("Error requesting data:", error);
            toast.error("Couldn't load the data.")
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (vehicleId) {
            fetchAllData()
        }
    }, [vehicleId]); 


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const resetForm = () => {
        setFormData({id: null, title: "", odometer: "", date: "", labor_cost: "", description: "", vehicle_id: ""})
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
        if (!window.confirm(`Are you sure to delete ${formData.title} service entry?`)) {
            return;
        }
        try {
            await ServiceAPI.delete(formData.id, vehicleId);
            fetchAllData();
            resetForm();
        } catch (error) {
            console.error(error);
                        toast.error(`Error during deleting ${formData.title} service entry.`)
        }
    };
    
    const handleSave = async () => {
        if (!formData.title || !formData.odometer || !formData.date || !formData.labor_cost || !formData.description) {
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

    const tableHeaders = ["Title", "Odometer", "Date", "Cost", "Description"];

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
                                    <Td>{event.title}</Td>
                                    <Td>{event.odometer} km</Td>
                                    <Td>{event.date}</Td>
                                    <Td>{event.labor_cost} HUF</Td>
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
                            name="title"
                            placeholder="Title"
                            value={formData.title}
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
                            type="date"
                            name="date"
                            placeholder="Date"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                        <ModalInput
                            type="number"
                            step={100}
                            min={0}
                            name="odometer"
                            placeholder="Odometer"
                            value={formData.odometer}
                            onChange={handleInputChange}
                        />
                        <ModalInput
                            type="number"
                            name="labor_cost"
                            step={1000}
                            min={0}
                            placeholder="Cost"
                            value={formData.labor_cost}
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