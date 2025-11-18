import logo from '../assets/logo.png';
import styled from 'styled-components';
import Image from './Image';
import profileIcon from '../assets/profile_icon.png'
import carIcon from '../assets/car_icon.png'
import wrenchIcon from '../assets/wrench_icon.png'
import suppliesIcon from '../assets/supplies_icon.png'

const Navbar = styled.nav`
    height: 100vh;
    width: 18%;
    z-index: 999;
    position: absolute;
    top: 0;   
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: rgb(28, 33, 42);
`

const Brand = styled.div`
    display: flex;
    user-select: none;

`

const Item = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0.5rem;
    background-color: rgb(40, 45, 56);
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

const Highlight = styled.h2`
    color: rgb(64, 224, 208);
    filter: drop-shadow(3px 2px 30px rgb(64, 224, 208));
`


function Nav() {
    return (
        <>
        <Navbar>
            <Brand>
                <Image src={logo} alt="Logo" height={1000} />
                <Highlight>Car-Care</Highlight>
            </Brand>
            <div>
                <Item><Image src={profileIcon} />User Profile</Item>
                <Item><Image src={carIcon} />Garage</Item>
                <Item><Image src={wrenchIcon} />Services</Item>
                <Item><Image src={suppliesIcon} />Supplies</Item>
            </div>
       
        </Navbar>
        </>
    )
}

export default Nav
