import styled from "styled-components"

const Container = styled.div`
    margin-left: 10%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 1000px) {
        margin-left: 0;
    }
`

export default Container