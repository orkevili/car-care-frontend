import { Redirect, Route, Switch, useLocation } from 'wouter'
import Auth from '../components/Auth'
import Nav from '../components/Nav'
import './App.css'
import Garage from '../components/Garage'
import Profile from '../components/Profile'
import Services from '../components/Services'
import Supplies from '../components/Supplies'
import { AuthContext } from '../components/AuthContext'
import { useContext } from 'react'
import Loader from '../components/Loading'

function App() {
  const { user, loading, logout } = useContext(AuthContext)

  if (loading) {
    return <Loader />
  }


  return (
    <>
    {user && <Nav user={user} logout={logout} />} 
    <Switch>
    <Route path="/" >
      {user ? <Redirect to='/profile' /> : <Redirect to='/login' />}
    </Route>
    <Route path="/login">
      <Auth />
    </Route>
    <Route path="/profile">
      <Profile user={user} />
    </Route>
    <Route path="/garage">
      <Garage />
    </Route>
    <Route path="/services/:vehicleId?">
      {user ? <Services /> : <Redirect to='/' />}
    </Route>
    <Route path="/supplies">
      <Supplies />
    </Route>
    </Switch>
    </>
  )
}

export default App
