import { useState, useEffect } from "react";
import { ServiceAPI, VehicleAPI } from "../Api"; 
import Container from "../components/Container";
import StyledButton from "../components/StyledButton";
import Title, { SmallTitle } from "../components/Title";
import Loader from "../components/Loading";
import { Table, Td, Tr } from "../components/StyledTable"
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { ActionButton, ButtonGroup, CancelButton, ModalContent, ModalInput, ModalOverlay, ModalTitle } from "../components/Modal";
import { useLocation } from "wouter";


function Services() {
    const [ ,setLocation] = useLocation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const vehicleId = localStorage.getItem("activeVehicleId");
    const vehicleName = localStorage.getItem("activeVehicleName");
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        description: "",
        date: "",
        odometer: "",
        labor_cost: "",
        vehicle_id: ""
    })

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
        } else {
            toast.warn("Please select a vehicle!");
            setLocation('/garage');
        }
    }, [vehicleId]); 


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const resetForm = () => {
        setFormData({id: null, title: "", description: "",  date: "", odometer: "", labor_cost: "", vehicle_id: ""})
    }

    const handleAddNew = () => {
        resetForm()
        setShowEditModal(true)
    }

    const handleEdit = (service) => {
        setFormData(service);
        setShowEditModal(true);
        console.log(service)
    }

    const handleDelete = async (service) => {
        if (!window.confirm(`Are you sure to delete ${service.title} service entry?`)) {
            return;
        }
        try {
            await ServiceAPI.delete(service.id);
            fetchAllData();
            resetForm();
        } catch (error) {
            console.error(error);
                        toast.error(`Error during deleting ${service.title} service entry.`)
        }
    };
    
    const handleSave = async () => {
        if (!formData.title || !formData.odometer || !formData.date || !formData.labor_cost || !formData.description) {
            toast.warn("Name, odometer, date and cost are required!")
            return
        }
        try {
            if (formData.id) {
                await ServiceAPI.update(formData.id, formData)
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


    const tableHeaders = ["Title", "Description", "Odometer", "Cost", "Date"];
    let totalCost = 0;
    for(let i=0; i < services.length; i++) {
        totalCost += services[i].labor_cost;
    }
    return (
        <Container>
            <Title>Service History</Title>
            <SmallTitle>{vehicleName}</SmallTitle>
            <b>Total cost</b>{totalCost} Ft 
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
                                    <Td>{event.description}</Td>
                                    <Td>{event.odometer} km</Td>
                                    <Td>{event.labor_cost} HUF</Td>
                                    <Td>{event.date}</Td>
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