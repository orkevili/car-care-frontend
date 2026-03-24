import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import { VehicleProvider } from './components/VehicleContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <VehicleProvider>
        <App />
      </VehicleProvider>
    </AuthProvider>
  </StrictMode>
)
