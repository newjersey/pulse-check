import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@newjersey/njwds/dist/css/styles.css";
import "@newjersey/njwds/dist/js/uswds-init.min.js";
import "@newjersey/njwds/dist/js/uswds.min.js";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
