    import Container from "../components/Container";
    import { Table, Td, Tr } from "../components/StyledTable"
    import Title, { SmallTitle } from "../components/Title";
    import StyledButton from "../components/StyledButton";
    import { ActionButton, ButtonGroup, CancelButton, ModalContent, ModalInput, ModalOverlay, ModalTitle } from "../components/Modal";
    import Loader from "../components/Loading";
    import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
    import { useState, useEffect } from "react";
    import { toast } from "react-toastify";
    import { PartAPI } from "../Api";

    function Supplies() {
        const [parts, setParts] = useState([])
        const [loading, setLoading] = useState(true)
        const [showEditModal, setShowEditModal] = useState(false)
        const vehicleId = localStorage.getItem("activeVehicleId");
        const vehicleName = localStorage.getItem("activeVehicleName");
        const [formData, setFormData] = useState({
                id: null,
                name: "",
                article_number: "",
                quantity: "",
                price: "",
            })
        
        const fetchAllData = async () => {
            try {
                setLoading(true);                
                const partResponse = await PartAPI.getById(vehicleId);
                if (Array.isArray(partResponse.data)) {
                    setParts(partResponse.data);
                } else {
                    setParts([]);
                }
            } catch (error) {
                console.error("Error requesting data:", error);
                toast.error("Couldn't load the data.")
                setParts([]);
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
                fetchAllData();
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
                    await PartAPI.create(vehicleId, formData)
                }
                setShowEditModal(false)
                resetForm()
                fetchAllData()
            } catch(error) {
                alert("Error during save.")
                console.error(error)
            }
        }

        <Loader />

        const tableHeaders = ["Name", "Article number", "Quantity", "Price"];

        return (
            <Container>
                <Title>Supplies</Title>
                <SmallTitle>{vehicleName}</SmallTitle>
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
                            {parts.length > 0 ? (
                                parts.map((part) => (
                                    <Tr key={part.id}>
                                        <Td>{part.name}</Td>
                                        <Td>{part.article_number}</Td>
                                        <Td>{part.quantity} PCS</Td>
                                        <Td>{part.price} Ft</Td>
                                        
                                        <Td>
                                            <ActionButton onClick={() => handleEdit(part)}><FiEdit /></ActionButton>
                                            <ActionButton onClick={() => handleDelete(part)}><FiTrash /></ActionButton>
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