import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/app'
import './app/globals.css'
import { WalletProvider } from './providers/wallet'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider gatewayDID="did:web:coralkm-wallet-gateway.developers-6d6.workers.dev">
      <App />
    </WalletProvider>
  </StrictMode>
)
