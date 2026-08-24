import { createRoot } from 'react-dom/client'
import './assets/styles/global.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
