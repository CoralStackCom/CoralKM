import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/app'
import './app/globals.css'
import { WalletProvider } from './providers/wallet'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider gatewayDID="did:web:localhost%3A8787">
      <App />
    </WalletProvider>
  </StrictMode>
)
