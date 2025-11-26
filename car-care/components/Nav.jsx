import styled from 'styled-components';
import { Link, useLocation } from 'wouter';
import Image from './Image';
import logo from '../assets/logo.png';
import profileIcon from '../assets/profile_icon.png'
import carIcon from '../assets/car_icon.png'
import wrenchIcon from '../assets/wrench_icon.png'
import suppliesIcon from '../assets/supplies_icon.png'
import Title from './Title';

const Navbar = styled.nav`
    height: 100vh;
    width: 18%;
    z-index: 999;
    position: absolute;
    top: 0;   
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: rgba(28, 33, 42, 0.25);
`

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0.5rem;
    text-decoration: none;
    color: white;
    background-color: rgba(40, 45, 56, 0.6);
    user-select: none;
    cursor: pointer;
    &:hover {
        background-color: rgb(45, 53, 66);
    }
    &:active {
        background-color: rgb(0, 143, 151);
        box-shadow: 2px 3px 5px rgba(32, 244, 255, 1);
    }
`

const HomeBtn = styled(Link)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    text-decoration: none;
 
`


function Nav({user, logout}) {
    const [, setLocation] = useLocation()

    const handleLogout = () => {
        logout()
        setLocation('/')
    }

    return (
        <>
        <Navbar>
            <HomeBtn to='/'>
                <img src={logo} height={75} alt="Logo" />
                <Title>Car-Care</Title>
            </HomeBtn>
            <StyledLink onClick={handleLogout}>{user.user}</StyledLink>
            <div>
                <StyledLink to='/profile'><Image src={profileIcon} />User Profile</StyledLink>
                <StyledLink to='/garage'><Image src={carIcon} />Garage</StyledLink>
                <StyledLink to='/services'><Image src={wrenchIcon} />Services</StyledLink>
                <StyledLink to='/supplies'><Image src={suppliesIcon} />Supplies</StyledLink>
            </div>
        
        </Navbar>
        </>
    )
}

export default Nav
