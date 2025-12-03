import styled from "styled-components";
import StyledButton from "./StyledButton";

const ModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
`;

const ModalContent = styled.div`
    background: linear-gradient(135deg, rgba(20, 20, 20, 1), rgba(47, 116, 109, 0.8));
    padding: 2rem;
    border-radius: 12px;
    border: 2px solid rgba(10, 230, 230, 1);
    width: 90%;
    max-width: 400px;
    box-shadow: 0 0 20px rgba(10, 230, 230, 0.5);
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ModalTitle = styled.h2`
    color: white;
    text-align: center;
    font-family: "Orbitron", sans-serif;
    margin-bottom: 1rem;
    font-size: 1.2rem;
`;

const ModalInput = styled.input`
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(10, 230, 230, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-family: inherit;
    &:focus {
        outline: none;
        border-color: rgba(10, 230, 230, 1);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
`;

const CancelButton = styled(StyledButton)`
    background-color: transparent;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    &:hover {
        background-color: rgba(255, 107, 107, 0.1);
        box-shadow: none;
    }
`;

const ActionModalContent = styled(ModalContent)`
    max-width: 300px;
    padding: 1.5rem;
    gap: 0.8rem;
`;

const ActionButton = styled(StyledButton)`
    width: 100%;
    margin: 0;
    padding: 0.75rem 0;
    font-size: 1rem;
`;

const DeleteButton = styled(ActionButton)`
    background-color: transparent;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    &:hover {
        background-color: rgba(255, 107, 107, 0.1);
        box-shadow: none;
    }
`;

export {ModalContent, ModalInput, ModalOverlay, ModalTitle, DeleteButton, ActionButton, ActionModalContent, CancelButton, ButtonGroup}