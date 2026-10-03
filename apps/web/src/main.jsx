// =============================================================================
// Socle frontend — point d'entrée
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// =============================================================================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/index.css'
import { App } from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
