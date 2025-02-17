import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { Stroe } from './Redux/Store.jsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './components/CartProvider.jsx'


createRoot(document.getElementById('root')).render(
  <Provider store={Stroe}>
    <StrictMode>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </StrictMode>
  </Provider>
)
