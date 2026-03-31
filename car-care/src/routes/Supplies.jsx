    import { Container } from "../components/Container";
    import { Table, Td, Tr } from "../components/StyledTable"
    import Title, { SmallTitle } from "../components/Title";
    import StyledButton from "../components/StyledButton";
    import { ActionButton, DeleteButton, ButtonGroup, CancelButton, ModalContent, ModalInput, ModalOverlay, ModalTitle } from "../components/Modal";
    import Loader from "../components/Loading";
    import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
    import { useState, useEffect, useContext } from "react";
    import { toast } from "react-toastify";
    import { PartAPI } from "../Api";
    import { VehicleContext } from "../components/VehicleContext";
import { useLocation } from "wouter";

    function Supplies() {
        const [ , setLocation] = useLocation();
        const [showEditModal, setShowEditModal] = useState(false)
        const [formData, setFormData] = useState({
                id: null,
                name: "",
                article_number: "",
                quantity: "",
                price: "",
            })
        const { activeVehicle, setActiveVehicle, services, setServices, parts, setParts, loading, fetchVehicleData } = useContext(VehicleContext);


        const handleInputChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }

        const resetForm = () => {
            setFormData({id: null, name: "", article_number: "", quantity: "", price: "",})
        }

        const handleAddNew = () => {
            resetForm()
            setShowEditModal(true)
        }

        const handleEdit = (part) => {
            setFormData(part);
            setShowEditModal(true);
        }

        const handleDelete = async (part) => {
            if (!window.confirm(`Are you sure to delete ${part.name} part entry?`)) {
                return;
            }
            try {
                await PartAPI.delete(part.id);
                fetchVehicleData(activeVehicle.id);
                resetForm();
            } catch (error) {
                console.error(error);
                            toast.error(`Error during deleting ${part.name} part entry.`)
            }
        };
        
        const handleSave = async () => {
            if (!formData.name || !formData.quantity || !formData.price) {
                toast.warn("Name, quantity and price are required!")
                return
            }
            try {
                if (formData.id) {
                    await PartAPI.update(formData.id, formData)
                } else {
                    await PartAPI.create(activeVehicle.id, formData)
                }
                setShowEditModal(false)
                resetForm()
                fetchVehicleData(activeVehicle.id)
            } catch(error) {
                alert("Error during save.")
                console.error(error)
            }
        }

        useEffect(() =>{
            if (!activeVehicle) {
                toast.warn("Please select a vehicle!");
                setLocation('/garage');
            }
        }, [activeVehicle]);

        <Loader />

        const tableHeaders = ["Name", "Article number", "Quantity", "Unit price"];
        let totalCost = 0;
        for(let i=0; i < parts.length; i++) {
            totalCost += parts[i].price*parts[i].quantity;
        }

        return (
            <Container>
                <Title>Supplies</Title>
                <SmallTitle>{`${activeVehicle?.make} ${activeVehicle?.model}`}</SmallTitle>
                <b>Total cost</b>{totalCost} Ft
                {activeVehicle && <StyledButton onClick={handleAddNew}><FiPlus />Add</StyledButton>}
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
                            {parts.length > 0 ? (
                                parts.map((part) => (
                                    <Tr key={part.id}>
                                        <Td>{part.name}</Td>
                                        <Td>{part.article_number}</Td>
                                        <Td>{part.quantity} PCS</Td>
                                        <Td>{part.price} Ft</Td>
                                        
                                        <Td>
                                            <ActionButton onClick={() => handleEdit(part)}><FiEdit /></ActionButton>
                                            <DeleteButton onClick={() => handleDelete(part)}><FiTrash /></DeleteButton>
                                            </Td>
                                    </Tr>
                                    
                                ))
                            ) : (
                                <tr>
                                    <Td colSpan={tableHeaders.length}>No part data</Td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
                {showEditModal && (
                    <ModalOverlay onClick={() => setShowEditModal(false)}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <ModalTitle>{formData.id ? `Edit part` : 'Add new part'}</ModalTitle>
                            <ModalInput
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <ModalInput
                                type="text"
                                name="article_number"
                                placeholder="Article number"
                                value={formData.article_number}
                                onChange={handleInputChange}
                            />
                            <ModalInput
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                            />
                            <ModalInput
                                type="number"
                                step={1000}
                                min={0}
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleInputChange}
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

    export default Supplies