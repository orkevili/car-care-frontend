import { Route, useLocation } from 'wouter'
import Auth from '../components/Auth'
import Nav from '../components/Nav'
import './App.css'
import Garage from '../components/Garage'
import Profile from '../components/Profile'
import Services from '../components/Services'
import Supplies from '../components/Supplies'
import { navigate } from 'wouter/use-hash-location'

function App() {
  return (
    <>
    <Nav /> 
    <Route path="/" >
      <Auth />
    </Route>
    <Route path="/profile">
      <Profile />
    </Route>
    <Route path="/garage">
      <Garage />
    </Route>
    <Route path="/services">
      <Services />
    </Route>
    <Route path="/supplies">
      <Supplies />
    </Route>
    </>
  )
}

export default App
