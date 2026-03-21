import { Redirect, Route, Switch, useLocation } from 'wouter'
import { AuthContext } from './components/AuthContext'
import Nav from './components/Nav'
import Auth from './routes/Auth'
import Garage from './routes/Garage'
import Profile from './routes/Profile'
import Services from './routes/Services'
import Supplies from './routes/Supplies'
import ErrorPage from './routes/ErrorPage'
import './App.css'
import { useContext } from 'react'
import Loader from './components/Loading'
import { ToastContainer } from 'react-toastify'

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
      {user ? <Redirect to='/garage' /> : <Redirect to='/login' />}
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
    <Route path="/vehicles/:vehicleId?">
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
