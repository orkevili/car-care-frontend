import { useState, useEffect, useContext, act } from "react";
import { PartAPI, ServiceAPI } from "../Api"; 
import { Container } from "../components/Container";
import StyledButton from "../components/StyledButton";
import Title, { SmallTitle } from "../components/Title";
import Loader from "../components/Loading";
import { Table, Td, Tr } from "../components/StyledTable"
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { ActionButton, ButtonGroup, CancelButton, DeleteButton, ModalContent, ModalInput, ModalSelector, ModalSelect, ModalOverlay, ModalTitle, ModalOption, ModalList, ModalLi } from "../components/Modal";
import { useLocation } from "wouter";
import { VehicleContext } from "../components/VehicleContext";


function Services() {
    const [ ,setLocation] = useLocation();
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPart, setCurrentPart] = useState({part_id: "", quantity: 1});
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        description: "",
        date: "",
        odometer: "",
        labor_cost: "",
        vehicle_id: "",
        used_parts: []
    })

    const { activeVehicle, setActiveVehicle, services, setServices, parts, setParts, loading, fetchVehicleData } = useContext(VehicleContext);


    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    }

    const resetForm = () => {
        setFormData({id: null, title: "", description: "",  date: getTodayDate(), odometer: "", labor_cost: "", vehicle_id: "", used_parts: []});
        setCurrentPart({part_id: "", quantity: 1});
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddNew = () => {
        resetForm();
        setShowEditModal(true);
    };

    const handleEdit = (service) => {
        setFormData(service);
        setShowEditModal(true);
    };

    const handleDelete = async (service) => {
        if (!window.confirm(`Are you sure to delete ${service.title} service entry?`)) {
            return;
        }
        try {
            await ServiceAPI.delete(service.id);
            fetchVehicleData(activeVehicle.id);
            resetForm();
        } catch (error) {
            console.error(error);
                        toast.error(`Error during deleting ${service.title} service entry.`)
        }
    };
    
    const handleSave = async () => {
        if (!formData.title || !formData.odometer || !formData.date || !formData.labor_cost) {
            toast.warn("Title, odometer, date and cost are required!");
            return
        }
        try {
            if (formData.id) {
                await ServiceAPI.update(formData.id, formData)
            } else {
                await ServiceAPI.create(activeVehicle.id, formData)
            }
            setShowEditModal(false);
            resetForm();
            fetchVehicleData(activeVehicle.id);
        } catch(error) {
            toast.error(`Error during save, ${error}`);
            console.error(error);
        }
    };

    const handleAddPart = () => {
        if (!currentPart.part_id) {
            toast.warn("Please select a part first!");
            return;
        }
        const selectedPartInfo = parts.find(p => p.id === parseInt(currentPart.part_id));
        if (!selectedPartInfo) {
            toast.error("Part not found!");
            return;
        }
        const existingPartIndex = formData.used_parts.findIndex(
            (p) => parseInt(p.part_id) === parseInt(currentPart.part_id)
        );
        let updatedUsedParts = [...formData.used_parts];
        if (existingPartIndex >= 0) {
            updatedUsedParts[existingPartIndex].quantity += currentPart.quantity;
        } else {
            updatedUsedParts.push({
            part_id: currentPart.part_id,
            part_name: selectedPartInfo.name,
            quantity: currentPart.quantity
        });
        }
        setFormData({
            ...formData,
            used_parts: updatedUsedParts
        });
        setCurrentPart({part_id: "", quantity: 1});
    };
    
    const handleDeletePartFromService = (indexToRemove) => {
        const updatedParts = formData.used_parts.filter((_, index) => index !== indexToRemove);
        setFormData({...formData, used_parts: updatedParts});
    }

    useEffect(() =>{
        if (!activeVehicle) {
            toast.warn("Please select a vehicle!");
            setLocation('/garage');
        }
    }, [activeVehicle]);

    let totalCost = 0;
    for(let i=0; i < services.length; i++) {
        totalCost += services[i].labor_cost;
    }

    const sortedServices = [...services].sort((a, b) => {
        if (sortOrder === "desc") {
            return new Date(b.date) - new Date(a.date); 
        } else {
            return new Date(a.date) - new Date(b.date);
        }
    });

    return (
        <Container>
            <Title>Service History</Title>
            <SmallTitle>{`${activeVehicle?.make} ${activeVehicle?.model}`}</SmallTitle>
            <b>Total cost</b>{totalCost} Ft 
            {activeVehicle && <StyledButton onClick={handleAddNew}><FiPlus />Add</StyledButton>}
            {loading ? (
                <Loader />
            ) : (
                <Table>
                    <thead>
                        <Tr>
                            <Td>Title</Td>
                            <Td>Description</Td>
                            <Td>Odometer</Td>
                            <Td>Cost</Td>
                            <Td onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}>Date {sortOrder === "desc" ? "▼" : "▲"}</Td>
                        </Tr>
                    </thead>
                    <tbody>
                        {sortedServices.length > 0 ? (
                            sortedServices.map((event) => (
                                <Tr key={event.id}>
                                    <Td>{event.title}</Td>
                                    <Td>{event.description}</Td>
                                    <Td>{event.odometer} km</Td>
                                    <Td>{event.labor_cost} HUF</Td>
                                    <Td>{event.date}</Td>
                                    <Td>
                                        <ActionButton onClick={() => handleEdit(event)}><FiEdit /></ActionButton>
                                        <DeleteButton onClick={() => handleDelete(event)}><FiTrash /></DeleteButton>
                                    </Td>
                                </Tr>
                                
                            ))
                        ) : (
                            <tr>
                                <Td>No service data</Td>
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
                        <label>Part selector</label>
                        <ModalSelector>
                        <ModalSelect name="part_selector" value={currentPart.part_id} onChange={(e) => setCurrentPart({...currentPart, part_id: e.target.value, quantity: currentPart.quantity})}>
                            <ModalOption value="">Select part</ModalOption>
                            {parts.map(part => (
                                <ModalOption key={part.id} value={part.id}>
                                    {part.name} (In stock: {part.quantity})
                                </ModalOption>
                            ))}
                        </ModalSelect>
                        <ModalInput 
                            type="number"
                            name="part_quantity"
                            placeholder="Qty"
                            min={1}
                            value={currentPart.quantity}
                            onChange={(e) => setCurrentPart({...currentPart, quantity: parseInt(e.target.value) || 1})}
                        />
                        <StyledButton type="button" onClick={handleAddPart}>Add</StyledButton>
                        </ModalSelector>
                        
                        <label>Used parts</label>
                        <ModalList>
                            {formData.used_parts &&formData.used_parts.map((part, index) => (
                                <ModalLi key={index}>
                                    <span>{part.part_name} - {part.quantity_used || part.quantity} PCS</span>
                                    <DeleteButton onClick={() => handleDeletePartFromService(index)}>X</DeleteButton>
                                </ModalLi>
                            ))}
                        </ModalList>

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