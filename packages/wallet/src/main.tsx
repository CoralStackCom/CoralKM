import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/app'
import './app/globals.css'
import { WalletProvider } from './providers/wallet'

// Import value from .env or .env.local file in the wallet package root
const gatewayDID = import.meta.env.VITE_GATEWAY_DID
console.log('Using gateway DID:', gatewayDID)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider gatewayDID={gatewayDID}>
      <App />
    </WalletProvider>
  </StrictMode>
)
