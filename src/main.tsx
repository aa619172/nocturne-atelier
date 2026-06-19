import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PlayerProvider } from './context/PlayerContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <AuthProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </AuthProvider>
    </AccessibilityProvider>
  </StrictMode>,
)
