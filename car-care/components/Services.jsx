import { useState, useEffect } from "react";
import { ServiceAPI, VehicleAPI } from "./Api"; 
import Container from "./Container";
import StyledButton from "./StyledButton";
import Title from "./Title";
import styled from "styled-components";
import { useRoute } from "wouter";
import Loader from "./Loading";

const Table = styled.table`
    margin: 1rem;
    background-color: rgba(47, 116, 109, 1);
    border-radius: 6px;
    width: 95%; /* Teljesebb szélesség */
`;

const Tr = styled.tr`
    height: 3rem;
    &:first-child > td { 
        border-bottom: 2px solid rgba(20, 97, 97, 1);
        font-weight: bold;
    }
    &:hover {
        background-color: rgba(47, 116, 109, 0.8);
    }
`;

const Td = styled.td`
    width: fit-content;
    text-align: center;
    padding: 0.5rem;
    color: white; /* Hogy látszódjon a szöveg */
`;

function Services() {
    const [serviceEvents, setServiceEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vehicleMap, setVehicleMap] = useState({});     
    const [match, params] = useRoute("/services/:vehicleId");
    const vehicleId = params ? params.vehicleId : null;
    
    const pageTitle = vehicleId 
        ? `Jármű Szerviztörténet (${vehicleMap[vehicleId] || 'ID: ' + vehicleId})` 
        : "Összes szerviztörténet";

    useEffect(() => {
        
        const fetchAllData = async () => {
            let serviceResponse;
            try {
                setLoading(true);                
                const vehicleResponse = await VehicleAPI.getAll();
                const rawVehicleData = vehicleResponse.data.Vehicles; 
                const map = {};

                if (rawVehicleData) {
                    const vehicleArray = Object.entries(rawVehicleData).map(([key, value]) => ({ id: key, ...value }));
                    vehicleArray.forEach(v => {
                        map[v.id] = `${v.brand} ${v.model}`;
                    });
                }
                setVehicleMap(map);
                
                if (vehicleId) {
                    serviceResponse = await ServiceAPI.getById(vehicleId);
                } else {
                    serviceResponse = await ServiceAPI.getAll(); 
                }
                
                const rawServiceData = serviceResponse.data.Services; 
                
                if (rawServiceData) {
                    const servicesArray = Object.entries(rawServiceData).map(([key, value]) => ({
                        id: key, 
                        vehicle_id: String(value.vehicle_id), 
                        ...value
                    }));
                    setServiceEvents(servicesArray);
                } else {
                    setServiceEvents([]);
                }
            } catch (error) {
                console.error("Hiba az adatok lekérésekor:", error);
                setServiceEvents([]);
                setVehicleMap({});
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [vehicleId]); 

    const tableHeaders = [
        `${!vehicleId ? "Jármű" : ""}`, "Esemény", "Km állás", "Dátum", "Költség", "Leírás"
    ];

    return (
        <Container>
            <Title>{pageTitle}</Title>
            <StyledButton>Add new</StyledButton>
            
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
                        {serviceEvents.length > 0 ? (
                            serviceEvents.map((event) => (
                                <Tr key={event.id}>
                                    {!vehicleId ? <Td>{vehicleMap[event.vehicle_id] || `ID: ${event.vehicle_id}`}</Td> : <Td></Td>}
                                    <Td>{event.name}</Td>
                                    <Td>{event.odometer} km</Td>
                                    <Td>{new Date(event.time).toLocaleDateString()}</Td>
                                    <Td>{event.cost} HUF</Td>
                                    <Td>{event.description}</Td>
                                </Tr>
                            ))
                        ) : (
                            <tr>
                                <Td colSpan={tableHeaders.length}>Nincs szervizbejegyzés.</Td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
            
        </Container>
    );
}

export default Services;