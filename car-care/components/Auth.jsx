import styled from "styled-components"
import Container from "./Container"

const Form = styled.form`
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  alig-items: center;
  filter: drop-shadow(3px 4px 100px rgb(64, 224, 208));
`

const Input = styled.input`
  font-family: "Orbitron", sans-serif;
  color: white;
  margin: 0.2rem;
  padding: 0.3rem;
  text-align: center;
  border-color: rgba(10, 230, 230, 1);
  border-radius: 6px;
  border-width: 3px;
  box-shadow: 2px 2px 5px black;
  background: transparent;
  &::placeholder {
    color: white;
    opacity: 0.5;
  }
`

const StyledButton = styled.button`
  font-family: "Orbitron", sans-serif;
  margin: 0.3rem;
  padding: 0.6rem;
  max-height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border-radius: 6px;
  border-color: rgba(10, 230, 230, 1);
  border-width: 3px;
  color: white;
  &:hover {
    color: gray;
    cursor: pointer;
  }
`

const StyledLink = styled.a`
  text-decoration: none;
  text-align: center;
  padding: 0.2rem;
  color: white;
  &:hover {
    color: gray;
    text-decoration: underline;
  }
` 

function Auth() {
  return (
        <Container>
        <Form action="/register">
          <Input type="text" placeholder='username' name='username' />
          <Input type="password" placeholder='password' name='password' />
          <StyledButton type='submit'>Login</StyledButton>
            <StyledLink href="#">Forgot password</StyledLink>
            <StyledLink href="#">Register here!</StyledLink>
        </Form>
        </Container>
  )
}

export default Auth