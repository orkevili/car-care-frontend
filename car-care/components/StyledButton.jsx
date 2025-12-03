import styled from "styled-components";

const StyledButton = styled.button`
  font-family: "Orbitron", sans-serif;
  font-size: 1.3rem;
  margin: 0.5rem;
  padding: 1.2rem;
  max-height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border-radius: 6px;
  background-color: rgba(10, 89, 89, 1);
  border-color: rgba(10, 230, 230, 1);
  border-width: 3px;
  color: white;
  transition: 0.2s all ease-in-out;
  &:hover {
    color: black;
    background-color: rgba(2, 155, 155, 1);
    cursor: pointer;
  }
  @media only screen and (max-width: 1000px) {
    font-size: 0.72rem;
  }
`

export default StyledButton