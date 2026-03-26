import styled from "styled-components";
import Container from "../components/Container";
import Title from "../components/Title";
import { useState, useEffect, useContext, useRef } from "react";
import Loader from "../components/Loading";
import { VehicleContext } from "../components/VehicleContext";
import StyledButton from "../components/StyledButton";
import { toast } from "react-toastify";
import { FileAPI } from "../Api";

const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 150px;
    width: 150px;
    padding: 1rem;
    border-radius: 6px;
    background-color: rgba(47, 116, 109, 1);
    border: 2px solid;
    border-color: rgba(10, 230, 230, 1);
`

const CardsPage = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    box-shadow: 2px 3px 20px black;
    @media only screen and (max-width: 1000px) {
        flex-direction: column;
    }
`

const CardTitle = styled.p`
    font-size: 1.3rem;
    text-align: center;
    font-weight: bold;
    
`

const Description = styled.p`
    text-align: center;
    font-size: 1rem;
`

const ButtonBox = styled.div`
    display: flex;
    margin: 2rem;
    filter: drop-shadow(2px 3px 5px black);
`


function Profile() {
    const [loading, setLoading] = useState(true);
    const [cost, setCost] = useState(0);
    const [vehicleCount, setVehicleCount] = useState(0);
    const [serviceCount, setServiceCount] = useState(0);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const { vehicles, services, parts } = useContext(VehicleContext);


    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
                toast.error("Please select a CSV fájl!");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warn("No file selected!");
        }
        setIsUploading(true);
        try {
            const resp = await FileAPI.upload(file);
            if (resp.ok) {
                toast.success(`Upload success!`);
                setFile(null);
            } else {
                toast.error("Error during upload!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error occured");
        } finally {
            setIsUploading(false);
        }
    }
    
    function exportData() {
        toast.warn("Choose where to export the data!");
    };

    function getCost() {
        let sumCost = 0;
        if (!services) return 0;
        services.forEach(service => {
            sumCost += Number(service.labor_cost);
            service.used_parts && Array.isArray(service.used_parts) && service.used_parts.forEach((parts) => {
                sumCost += Number(parts.part_price)*Number(parts.quantity_used);
            });
        });
        return sumCost;
    };
    

    useEffect(() => {
        try {
            setCost(getCost());
            setVehicleCount(vehicles.length);
            setServiceCount(services.length);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [vehicles, services, parts]);

    return (
        <>
        {loading ? (
                <Loader />
            ) : (
                <Container>
                    <Title>Profile</Title>
                    <ButtonBox>
                        <StyledButton onClick={() => fileInputRef.current.click()}>Select CSV</StyledButton>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                        <StyledButton onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? "Uploading..." : "Import Data"}
                        </StyledButton>
                        <StyledButton onClick={exportData}>Export data</StyledButton>
                    </ButtonBox>
                    <CardsPage>
                    <Card>
                        <CardTitle>Total cost</CardTitle>
                        <Description>{cost} HUF</Description>
                    </Card>
                    <Card>
                        <CardTitle>Vehicles</CardTitle>
                        <Description>{vehicleCount}</Description>
                    </Card>
                    <Card>
                        <CardTitle>Services</CardTitle>
                        <Description>{serviceCount}</Description>
                    </Card>
                    </CardsPage>
                </Container>
            )}
        </>
    )
}

export default Profile