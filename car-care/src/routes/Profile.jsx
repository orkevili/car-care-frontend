import styled from "styled-components";
import Container from "../components/Container";
import Title from "../components/Title";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { AuthAPI } from "../Api";
import Loader from "../components/Loading";

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

function Profile() {
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cost, setCost] = useState(0);
    const [vehicleCount, setVehicleCount] = useState(0);
    const [serviceCount, setServiceCount] = useState(0);
    const [, setLocation] = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await AuthAPI.getUserData();
            const { totalCost, vehicleCount, serviceCount } = response.data;
            setCost(totalCost)
            setVehicleCount(vehicleCount)
            setServiceCount(serviceCount)
        } catch(error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
        }
        fetchUserData();
    }, [])

    // useEffect(() => {
    //     const fetchVehicles = async () => {
    //         try {
    //             const response = await VehicleAPI.getAll();
    //             const rawData = response.data.Vehicles;
    //             if (rawData) {
    //                 const vehiclesArray = Object.entries(rawData).map(([key, value]) => ({
    //                     id: key,
    //                     ...value
    //                 }));                    
    //                 setVehicles(vehiclesArray);
    //             } else {
    //                 setVehicles([]);
    //             }
    //         } catch (error) {
    //             console.error("Hiba:", error);
    //             setVehicles([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //         };

    //     const fetchServices = async () => {
    //         try {
    //             const response = await ServiceAPI.getAll()
    //             const rawData = response.data.Services
    //             if (rawData) {
    //                 const servicesArray = Object.entries(rawData).map(([key, value]) => ({
    //                     id: key,
    //                     ...value
    //                 }))
    //                 setServices(servicesArray)
    //             } else {
    //                 setServices([])
    //             }
    //         } catch (error) {
    //             console.error("Hiba:", error)
    //             setServices([])
    //         } finally {
    //             setLoading(false)
    //         }
    //     }
    //     fetchServices();
    //     fetchVehicles();
    //     }, []);

    return (
        <>
        {loading ? (
                <Loader />
            ) : (
                <Container>
                    <Title>Profile</Title>
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