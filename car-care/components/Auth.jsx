import styled from "styled-components"
import StyledButton from "./StyledButton"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { useLocation, Link } from "wouter"
import Title from "./Title"

const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Javítottam az elírást: alig-items -> align-items */
  filter: drop-shadow(3px 4px 100px rgb(64, 224, 208));
`

const Input = styled.input`
  font-family: "Orbitron", sans-serif;
  font-size: 1rem;
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
const StyledLinkComponent = styled(Link)` 
  margin: 0.2rem;
  padding: 0.2rem;
  font-size: 0.7rem;
  text-decoration: none;
  text-align: center;
  color: white;
  transition: 0.2s all ease-in-out;
  cursor: pointer;
  &:hover {
    color: gray;
    text-decoration: underline;
  }
` 
const ErrorMessage = styled.div`
  color: #ff6b6b; /* Pirosas szín */
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #ff6b6b;
  border-radius: 4px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
  max-width: 300px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

function Auth() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const { login, message, user, loading } = useContext(AuthContext);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      setLocation("/login")
    }
  }, [user, loading, setLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await login(username, password);
    if (result.success) {
      setLocation("/profile");
    } else {
      setError(JSON.parse(result.message).error);
    }
  };

  if (loading) {
    return <Container><p style={{color: "white"}}>Betöltés...</p></Container>;
  }

  return (
        <Container>
        <Title>{message}</Title>
        <Form onSubmit={handleSubmit}>          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input 
            type="text" 
            placeholder='username' 
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder='password' 
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
           />
          <StyledButton type='submit'>Login</StyledButton>
            
            <StyledLinkComponent href="/forgot">Forgot password</StyledLinkComponent>
            <StyledLinkComponent href="/">
                You don't have an account?<br />Register here!
            </StyledLinkComponent>
        </Form>
        </Container>
  )
}

export default Auth