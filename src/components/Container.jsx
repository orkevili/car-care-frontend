import styled from "styled-components"

export const Container = styled.div`
    margin-left: 10%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 1000px) {
        margin-left: 0;
    }
`;

export const SmallContainer = styled.div`
    margin: 2rem;
    padding: 0.24rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    background-color: rgba(10, 89, 89, 1);
    border-color: rgba(10, 230, 230, 1);
    border-width: 3px;
    color: white;
    transition: 0.2s all ease-in-out;
    & > ul {
        list-style: none;
    }
    & > ul > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.3rem;
        }
`;
