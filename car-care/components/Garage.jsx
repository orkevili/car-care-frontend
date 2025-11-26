import { useLocation } from "wouter";
import { VehicleAPI } from "./Api";
import Container from "./Container";
import StyledButton from "./StyledButton";
import Title from "./Title";
import styled from "styled-components";
import { useState, useEffect } from "react";

const Card = styled.div`
    min-width: 100%;
    border-radius: 6px;
    background-color: rgba(47, 116, 109, 1);
    border: 2px solid;
    border-color: rgba(10, 230, 230, 1);
`

const CardsPage = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    margin: 1rem;
    box-shadow: 2px 3px 20px black;
    flex-wrap: wrap; /* Hozzáadtam, hogy ha sok autó van, új sorba törjön */
`

const CardTitle = styled.p`
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
`

const Description = styled.p`
    text-align: center;
    font-size: 0.9rem;
`

function Garage() {
    const [vehicles, setVehicles] = useState([]);
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

        fetchVehicles();
    }, []);

    const handleAddNew = () => {
        setLocation("/add-vehicle"); 
    };

    return (
        <Container>
            <Title>My garage</Title>
            
            {loading ? (
                <p style={{color: 'white', textAlign: 'center'}}>Betöltés...</p>
            ) : (
                <CardsPage>
                    {Array.isArray(vehicles) && vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <Card key={vehicle.id}>
                                <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                                <Description>{vehicle.year}</Description>
                                <Description>{vehicle.fuel}</Description>
                            </Card>
                        ))
                    ) : (
                        <p style={{color: 'white'}}>Még nincs járműved.</p>
                    )}
                </CardsPage>
            )}

            <StyledButton onClick={handleAddNew}>Add new</StyledButton>
        </Container>
    );
}

export default Garage;