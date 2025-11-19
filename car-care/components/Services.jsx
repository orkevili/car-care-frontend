import Container from "./Container";
import StyledButton from "./StyledButton";
import Title from "./Title";
import styled from "styled-components";

const Table = styled.table`
    margin: 1rem;
    background-color: rgba(47, 116, 109, 1);
    border-radius: 6px;
`

const Tr = styled.tr`
    height: 3rem;
    &:first-child {
        /* Az összes Td elemen belül alkalmazza a stílust */
        & > td { 
            border-bottom: 2px solid rgba(20, 97, 97, 1);
            font-weight: bold;
        }
`

const Td = styled.td`
    width: fit-content;
    text-align: center;
    padding: 0.5rem;
`

function Services() {
    return (
        <>
        <Container>
            <Title>Services</Title>
            <Table>
                <Tr>
                    <Td>Name</Td>
                    <Td>Part Number</Td>
                    <Td>Quantity</Td>
                    <Td>Price</Td>
                    <Td>Vehichle</Td>
                </Tr>
                <Tr>
                    <Td>Oil Filter</Td>
                    <Td>ASD123241</Td>
                    <Td>1</Td>
                    <Td>5000</Td>
                    <Td>Suzuki SX4</Td>
                </Tr>
                <Tr>
                    <Td>Suspension</Td>
                    <Td>BL-91345</Td>
                    <Td>2</Td>
                    <Td>21230</Td>
                    <Td>Volkswagen Vento</Td>
                </Tr>
                </Table>
                <StyledButton>Add new</StyledButton>
        </Container>
        </>
    )
}

export default Services