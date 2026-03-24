import Container from "../components/Container";
import Title, { SmallTitle } from "../components/Title";

function Summary() {
    const vehicleId = localStorage.getItem("activeVehicleId");
    const vehicleName = localStorage.getItem("activeVehicleName");
    return (
        <Container>
            <Title>Summary</Title>
            <SmallTitle>{vehicleName}</SmallTitle>
        </Container>
    )
}

export default Summary;