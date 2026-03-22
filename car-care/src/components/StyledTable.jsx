import styled from "styled-components";

export const Table = styled.table`
    background-color: rgba(47, 116, 109, 1);
    border-radius: 6px;
    width: 80%;
    & > thead td {
        margin-top: 10rem;
        color: hsla(174, 92%, 71%, 1.00);
        border-bottom: 2px solid rgba(20, 97, 97, 1);
        font-weight: bold;
    }
    @media (max-width: 900px) {
        & > thead {
            display: none;
        }
        display: block;
        background-color: rgba(47, 116, 109, 1);
        margin-bottom: 1rem;
        border-radius: 8px;
        height: auto;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border: 1px solid rgba(20, 97, 97, 1);

`;

export const Tr = styled.tr`
    width: auto;
    height: 3rem;
    &:hover {
        background-color: rgba(9, 139, 126, 0.8);
        box-shadow: 2px 5px 200px black;
    }
    @media (max-width: 900px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(47, 116, 109, 1);
        border-radius: 8px;
        height: auto;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border: 1px solid rgba(20, 97, 97, 1);  
`;

export const Td = styled.td`
    width: auto;
    text-align: center;
    color: white;

    @media (max-width: 900px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: right;
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        &:last-child {
            border-bottom: none;
            justify-content: center;
            padding-top: 1rem;
        }
`;