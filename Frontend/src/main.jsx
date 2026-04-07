import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              fontSize: '14px',
              borderRadius: '12px',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)