import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AudioSettingsProvider } from './context/audio-settings-context.tsx'
import { UserStylesContext, UserStylesProvider } from './context/user-styles-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioSettingsProvider>
      <UserStylesProvider>
        <App />
      </UserStylesProvider>
    </AudioSettingsProvider>
  </React.StrictMode>,
)