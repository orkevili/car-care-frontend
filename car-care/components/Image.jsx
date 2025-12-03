import styled from "styled-components";

const Image = styled.img`
    height: 30px;
    padding: .5rem;
    aspect-ratio: 1;
    user-select: none;
    @media only screen and (max-width: 1000px) {
        height: 50px;
    }
`

export const Logo = styled(Image)`
    height: 100px;
    @media only screen and (max-width: 1000px) {
        height: 75px;
    }
`

export default Image