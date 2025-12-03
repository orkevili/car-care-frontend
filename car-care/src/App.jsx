import { Redirect, Route, Switch, useLocation } from 'wouter'
import Auth from '../components/Auth'
import Nav from '../components/Nav'
import './App.css'
import Garage from '../components/Garage'
import Profile from '../components/Profile'
import Services from '../components/Services'
import Supplies from '../components/Supplies'
import { AuthContext } from '../components/AuthContext'
import { useContext, useEffect, useState } from 'react'
import Loader from '../components/Loading'
import { toast, ToastContainer } from 'react-toastify'
import ErrorPage from '../components/ErrorPage'
import { navigate } from 'wouter/use-browser-location'

function App() {
  const { logout, user, loading, serverDown } = useContext(AuthContext)

  if (loading) {
    return <Loader />
  }

  if (serverDown) {
    return <ErrorPage />
  }

  return (
    <>
    {user && <Nav user={user} logout={logout} />} 
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark" 
      toastStyle={{ 
        backgroundColor: 'transparent', 
        border: 'none',
      }}
    />
    <Switch>
    <Route path="/" >
      {user ? <Redirect to='/profile' /> : <Redirect to='/login' />}
    </Route>
    <Route path="/login">
      {user ? <Redirect to='/profile' /> : <Auth />}
    </Route>
    <Route path="/register">
      {user ? <Redirect to='/profile' /> : <Auth />}
    </Route>
    <Route path="/profile">
      {user ? <Profile user={user} /> : <Redirect to='/login' />}
    </Route>
    <Route path="/garage">
      {user ? <Garage /> : <Redirect to='/login' />}
    </Route>
    <Route path="/services/:vehicleId?">
      {user ? <Services /> : <Redirect to='/' />}
    </Route>
    <Route path="/supplies">
      {user ? <Supplies /> : <Redirect to='/login' />}
    </Route>
    </Switch>
    </>
  )
}

export default App
