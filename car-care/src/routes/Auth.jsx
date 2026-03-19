import styled from "styled-components"
import StyledButton from "../components/StyledButton"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../components/AuthContext"
import { useLocation } from "wouter"
import Title from "../components/Title"
import Loader from "../components/Loading"
import { toast } from "react-toastify"

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
  font-size: 1.5rem;
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
  @media only screen and (max-width: 1000px) {
    font-size: 1rem;
  }
`
const Button = styled.button`
  margin-top: 1rem;
  font-size: 1rem;
  text-decoration: none;
  text-align: center;
  color: white;
  background: transparent;
  border: none;
  transition: 0.2s all ease-in-out;
  cursor: pointer;
  &:hover {
    color: rgba(19, 214, 180, 1);
    text-decoration: underline;
  }
  @media only screen and (max-width: 1000px) {
    font-size: 0.72rem;
  }
` 

function Auth() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [registerForm, setRegisterForm] = useState(false)
  const [error, setError] = useState(null)

  const { login, message, user, loading, register } = useContext(AuthContext);
  const [, setLocation] = useLocation();

  useEffect(() => {
    toast(message, { type: "info" })
    if (!loading && user) {
      setLocation("/login/")
    }
    if (registerForm) {
      setLocation("/register/")
    } else {
      setLocation("/login/")
    }
  }, [user, loading, registerForm]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!registerForm) {
      const result = await login(username, password);
      if (result.access) {
        setLocation("/profile");
      } else {
        setError(JSON.parse(result.message).error);
      }
    } else {
      const result = await register(username, password)
      if (result.success) {
        setRegisterForm(false)
        setLocation("/login")
      } else {
        setError(result.message)
        toast.error(result.message.response.data.error)
      }
    }
  
  };

  if (loading) {
    return <Loader />
  }

  return (
        <Container>
          <Title>{registerForm ? "Register" : "Login"}</Title>
          <Form onSubmit={handleSubmit}>          
            <Input 
              type="text" 
              placeholder='username' 
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input 
              type="password" 
              placeholder='password' 
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="buttonContainer">
              <div className="smallContainer">
                <StyledButton type='submit'>{!registerForm ? "Login" : "Register"}</StyledButton>
                {!registerForm && <StyledButton type="button" onClick={() => toast.success("Password reminder not implemented, yet")}>Forgot password</StyledButton>}
              </div>
              <Button type="button" onClick={ () => setRegisterForm(prev => !prev) }>
                  {registerForm ? "Already have an account? Login here!" : "Don't have an account yet? Register here!"}
              </Button>
            </div>        
          </Form>
        </Container>
  )
}

export default Auth