import styled from 'styled-components';
import { Link, useLocation } from 'wouter';
import Image, { Logo } from './Image';
import logo from '../assets/logo.png';
import carIcon from '../assets/car_icon.png'
import wrenchIcon from '../assets/wrench_icon.png'
import suppliesIcon from '../assets/supplies_icon.png'
import { SmallTitle } from './Title';
import { FiLogOut } from 'react-icons/fi'


const Navbar = styled.nav`
    height: 100vh;
    width: auto;
    z-index: 999;
    position: fixed;
    top: 0;   
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: rgba(28, 33, 42, 0.45);
    box-shadow: 1px 0 12px rgba(0, 17, 17, 1);
    @media only screen and (max-width: 1000px) {
        width: 100%;
        flex-direction: row;
        height: 10vh;
        font-size: 0.7rem;
    }
`

const StyledLink = styled(Link)`
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0.5rem;
    text-decoration: none;
    color: white;
    user-select: none;
    cursor: pointer;
    &:hover {
        background-color: rgb(45, 53, 66);
    }
    &:active {
        background-color: rgb(0, 143, 151);
        box-shadow: 2px 3px 5px rgba(32, 244, 255, 1);
    }
    @media only screen and (max-width: 1000px) {
        & > span {
            display: none;
        }
    }
    
`

const HomeBtn = styled(Link)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    text-decoration: none;
    color: white;
    @media only screen and (max-width: 1000px) {
        display: block;
        & > h2 {
            display: none;
        }
        & > img {
            max-height: 8vh;
        }
    }
`

const LogoutBtn = styled.button`
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    justify-content: center;
    align-items: center;
    background-color: rgba(40, 45, 56, 0.6);
    border: none;
    color: white;
    font-size: 1.6rem;
    transition: 2s ease-in-out;
    & :hover {
        cursor: pointer;
        scale: 1.1;
    }
    @media only screen and (max-width: 1000px) {
        background: none;
        font-size: 1rem;
    }
`

const MenuGroup = styled.div`
    background-color: rgba(40, 45, 56, 0.6);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-height: 5rem;
    @media only screen and (max-width: 1000px) {
        background: none;
        flex-direction: row;
    }
`


function Nav({user, logout}) {
    const [, setLocation] = useLocation()

    const handleLogout = () => {
        logout()
        setLocation('/login')
    }

    return (
        <>
        <Navbar>
            <HomeBtn to='/'>
                <Logo src={logo} alt="Logo" />
                <SmallTitle>Car-Care</SmallTitle>
            </HomeBtn>
            <LogoutBtn onClick={handleLogout}>{user}<FiLogOut /></LogoutBtn>
            <MenuGroup>
                <StyledLink to='/garage'><Image src={carIcon} /><span>Garage</span></StyledLink>
                <StyledLink to='/services'><Image src={wrenchIcon} /><span>Services</span></StyledLink>
                <StyledLink to='/supplies'><Image src={suppliesIcon} /><span>Supplies</span></StyledLink>
                <StyledLink to='/summary'><Image src={suppliesIcon} /><span>Summary</span></StyledLink>
            </MenuGroup>
        
        </Navbar>
        </>
    )
}

export default Nav
