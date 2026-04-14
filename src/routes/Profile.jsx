import styled from "styled-components";
import { Container, SmallContainer } from "../components/Container";
import Title, { SmallTitle } from "../components/Title";
import { useState, useEffect, useContext, useRef } from "react";
import Loader from "../components/Loading";
import { VehicleContext } from "../components/VehicleContext";
import StyledButton from "../components/StyledButton";
import { toast } from "react-toastify";
import { FileAPI, AuthAPI } from "../Api";
import { DeleteButton, ModalSelect }  from "../components/Modal";

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
    const [vehicleCount, setVehicleCount] = useState(0);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const { vehicles, services, parts, fetchVehicles } = useContext(VehicleContext);


    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith('.json')) {
                toast.error("Please select a JSON file!");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warn("No file selected!");
            return;
        }
        setIsUploading(true);
        try {
            const resp = await FileAPI.upload(file);
            if (resp.status == 200) {
                toast.success(`Data uploaded to server!`);
                setFile(null);
                fetchVehicles();
            } else {
                toast.error("Error during upload!");
            }
        } catch (error) {
            console.error(error);
            toast.error(`Error during upload, ${error}`);
        } finally {
            setIsUploading(false);
        }
    }

    const handleExport = async () => {
        try {
            const resp = await FileAPI.exportData();
            if (resp.status === 200 && resp.data.backup_data) {
                const jsonString = JSON.stringify(resp.data.backup_data, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const dateString = new Date().toISOString().split('T')[0];
                link.setAttribute('download', `car_care_backup_${dateString}.json`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success(resp.data.msg || "Export successful!");
            } else {
                toast.error("Error during requesting data!");
            }
        } catch (error) {
            console.error("Export error:", error);
            const serverErrorMessage = error.response?.data?.error || "Network error has occured during the data export!";
            toast.error(serverErrorMessage);
        }
    };

    const handleDeleteProfile = async () => {
        const isConfirmed = window.confirm("Are you sure want to delete your profile with all your data?");
        if (!isConfirmed) return;
        try {
            const resp = AuthAPI.deleteProfile();
            if (resp.status === 200) {
                toast.success("Your account has been deleted permamently!");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setLocation('/login');
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during profile delete!");
        }
    }
    

    useEffect(() => {
        try {
            setVehicleCount(vehicles.length);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [vehicles, services, parts]);

    return (
        <>
        {loading && <Loader />}
        <Container>
            <Title>Profile</Title>
            <ButtonBox>
                <StyledButton onClick={() => fileInputRef.current.click()}>Select JSON</StyledButton>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <StyledButton onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Import Data"}
                </StyledButton>
                <StyledButton onClick={handleExport}>Export data</StyledButton>
            </ButtonBox>
            <span>Vehicles: {vehicleCount}</span>
            <SmallContainer>
                <SmallTitle>Settings</SmallTitle>
                <SmallContainer>
                    <ul>
                        <li>
                            <label for="language">Language</label>
                            <ModalSelect name="language" id="language" />
                        </li>
                        <li>
                            <label for="currency">Currency</label>
                            <ModalSelect name="currency" id="currency" />
                        </li>
                        <li>
                            <label for="theme">Theme</label>
                            <ModalSelect name="theme" id="theme" />
                            </li>
                    </ul>
                </SmallContainer>
            </SmallContainer>
            <DeleteButton onClick={() => handleDeleteProfile()}>Delete profile</DeleteButton>
        </Container>
        </>
    )
}

export default Profile