import styled from "styled-components";

const Loader = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(20, 20, 20, 1), rgba(47, 116, 109, 0.8));
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
    text-shadow: 2px 3px 5px rgba(10, 230, 230, 1);

    &::before {
    content: 'Loading...';
    font-size: 3rem;
    }
`

export default Loader