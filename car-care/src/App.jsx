import { Redirect, Route, Switch } from 'wouter'
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

  const requireAuth = (children, fallback = '/login') => {
    return user ? children : <Redirect to={fallback} />; 
  };

  const requireGuest = (children, fallback = '/garage') => {
    return user ? <Redirect to={fallback} /> : children; 
  };

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
      <Redirect to={user ? '/garage' : '/login'} />
    </Route>
    <Route path="/login">{requireGuest(<Auth />)}</Route>
    <Route path="/register">{requireGuest(<Auth />)}</Route>
    <Route path="/profile">{requireAuth(<Profile user={user} />)}</Route>
    <Route path="/garage">{requireAuth(<Garage />)}</Route>
    <Route path="/services">{requireAuth(<Services />)}</Route>
    <Route path="/supplies">{requireAuth(<Supplies />)}</Route>
    </Switch>
    </>
  )
}

export default App
