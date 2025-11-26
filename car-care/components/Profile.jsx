import styled from "styled-components";
import Container from "./Container";
import Title from "./Title";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ServiceAPI, VehicleAPI } from "./Api";
import Loader from "./Loading";

const Card = styled.div`
    height: 100px;
    width: 100px;
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
`

const CardTitle = styled.p`
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
    
`

const Description = styled.p`
    text-align: center;
    font-size: 0.8rem;
`

function Profile() {
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setLocation] = useLocation();

    useEffect(() => {
            const fetchVehicles = async () => {
                try {
                    const response = await VehicleAPI.getAll();
                    const rawData = response.data.Vehicles;
    
                    if (rawData) {
                        const vehiclesArray = Object.entries(rawData).map(([key, value]) => ({
                            id: key,
                            ...value
                        }));                    
                        setVehicles(vehiclesArray);
                    } else {
                        setVehicles([]);
                    }
    
                } catch (error) {
                    console.error("Hiba:", error);
                    setVehicles([]);
                } finally {
                    setLoading(false);
                }
            };

            const fetchServices = async () => {
                try {
                    const response = await ServiceAPI.getAll()
                    const rawData = response.data.Services
                    if (rawData) {
                        const servicesArray = Object.entries(rawData).map(([key, value]) => ({
                            id: key,
                            ...value
                        }))
                        setServices(servicesArray)
                    } else {
                        setServices([])
                    }
                } catch (error) {
                    console.error("Hiba:", error)
                    setServices([])
                } finally {
                    setLoading(false)
                }
            }
            
            fetchVehicles()
            fetchServices()
        }, []);

    return (
        <>
        {loading ? (
                <Loader />
            ) : (
                <Container>
                {console.log(services)}
                    <Title>Profile</Title>
                <CardsPage>
                <Card>
                    <CardTitle>Vehicles</CardTitle>
                    <Description>{vehicles.length}</Description>
                </Card>
                <Card>
                    <CardTitle>Services</CardTitle>
                    <Description>{services.length}</Description>
                </Card>
                <Card>
                    <CardTitle>Total cost</CardTitle>
                    <Description>{services.length}</Description>
                </Card>
                </CardsPage>
                </Container>
            )}
        </>
    )
}

export default Profile