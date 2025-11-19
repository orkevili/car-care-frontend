import Container from "./Container";
import StyledButton from "./StyledButton";
import Title from "./Title";
import styled from "styled-components";

const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    margin: 1rem;
    box-shadow: 2px 3px 20px black;
`

const CardTitle = styled.p`
    font-size: 0.8rem;
    text-align: center;
    font-weight: bold;
    
`

const Description = styled.p`
    text-align: center;
    font-size: 0.8rem;
`


function Garage() {
    return (
        <>
        <Container>
            <Title>My garage</Title>
            <CardsPage>
                <Card>
                    <CardTitle>Volkswagen Vento</CardTitle>
                    <Description>ELA</Description>
                </Card>
                <Card>
                    <CardTitle>Suzuki SX4</CardTitle>
                    <Description>KHG</Description>
                </Card>
            </CardsPage>
            <StyledButton>Add new</StyledButton>
        </Container>
        </>
    )
}

export default Garage