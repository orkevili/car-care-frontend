import styled from "styled-components";
import Container from "./Container";
import Title from "./Title";

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
    return (
        <>
        <Container>
            <Title>Profile</Title>
        <CardsPage>
        <Card>
            <CardTitle>Total vehicles</CardTitle>
            <Description>2</Description>
        </Card>
         <Card>
            <CardTitle>Upcoming service</CardTitle>
            <Description>Oil change</Description>
        </Card>
         <Card>
            <CardTitle>Last service</CardTitle>
            <Description>Brake pads</Description>
        </Card>
        </CardsPage>
        </Container>
        </>
    )
}

export default Profile