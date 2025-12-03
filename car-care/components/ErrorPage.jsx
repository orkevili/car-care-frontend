import styled from "styled-components";

const Container = styled.div`
    position: absolute;
    z-index: 999;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background: linear-gradient(135deg, rgba(20, 20, 20, 1), rgba(47, 116, 109, 0.8));

`

const Title = styled.h1`
    font-size: 2.5rem;
    text-align: center;
    text-decoration: underline;
    text-shadow: 2px 3px 5px rgba(10, 230, 230, 0.65);
    filter: drop-shadow(2px 3px 12px black);
    `

const Message = styled.p`
    font-size: 1.5rem;
    text-align: center;
    filter: drop-shadow(2px 3px 12px black);
`


function ErrorPage() {
    return (
        <Container>
        <Title>Network error</Title>
        <Message>Server is not available,<br></br>try again later.</Message>
        </Container>
    )
}

export default ErrorPage