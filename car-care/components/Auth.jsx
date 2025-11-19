import styled from "styled-components"
import Container from "./Container"
import StyledButton from "./StyledButton"

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
  transition: all 0.2 ease-in-out;
  &::placeholder {
    color: white;
    opacity: 0.5;
  }
  &:focus {
    border: black;
    outline: black;
  }
`
const StyledLink = styled.a`
  margin: 0.2rem;
  padding: 0.2rem;
  font-size: 0.6rem;
  text-decoration: none;
  text-align: center;
  color: white;
  transition: 0.2s all ease-in-out;
  &:hover {
    color: gray;
    text-decoration: underline;
  }
` 

function Auth() {
  return (
        <Container>
        <Form action="/login">
          <Input type="text" placeholder='username' name='username' />
          <Input type="password" placeholder='password' name='password' />
          <StyledButton type='submit'>Login</StyledButton>
            <StyledLink href="/forgot">Forgot password</StyledLink>
            <StyledLink href="/register">You don't have an account?<br />Register here!</StyledLink>
        </Form>
        </Container>
  )
}

export default Auth