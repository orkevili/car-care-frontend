import styled from "styled-components"

const Title = styled.h1`
    text-align: center;
    font-size: 2.7rem;
    color: rgb(64, 224, 208);
    filter: drop-shadow(3px 2px 30px rgb(64, 224, 208));
    &:hover {
        cursor: default;
    }
    @media only screen and (max-width: 1000px) {
        font-size: 2rem;
    }
`

export const SmallTitle = styled.h2`
    color: rgb(64, 224, 208);
    filter: drop-shadow(3px 2px 30px rgb(64, 224, 208));
    margin-bottom: 2rem;
    &:hover {
        cursor: default;
    }
     @media only screen and (max-width: 1000px) {
        font-size: 1.2rem;
  }
`

export default Title