import React from 'react'

import { WalletContext } from './context'
import { Wallet } from './wallet'

/**
 * Provider component to supply the Wallet instance via context
 * Added debug logging for initialization steps
 *
 * @param gatewayDID The DID of the wallet gateway mediator
 */
export function WalletProvider({
  gatewayDID,
  children,
}: {
  gatewayDID: string
  children: React.ReactNode
}) {
  console.log('[WalletProvider] Initializing with gatewayDID:', gatewayDID)

  // Keep Wallet instance stable across re-renders and StrictMode re-mounts
  const walletRef = React.useRef<Wallet | null>(null)
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [initError, setInitError] = React.useState<Error | null>(null)

  if (walletRef.current === null) {
    // Create only once per provider lifetime
    console.log('[WalletProvider] Creating Wallet instance')
    walletRef.current = new Wallet(gatewayDID)
  }

  React.useEffect(() => {
    let cancelled = false
    const initWallet = async () => {
      console.log('[WalletProvider.initWallet] Starting wallet initialization')
      try {
        await walletRef.current!.init()
        if (!cancelled) {
          console.log('[WalletProvider.initWallet] ✓ Wallet initialized successfully')
          setIsInitialized(true)
          setInitError(null)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        console.error('[WalletProvider.initWallet] Failed to initialize wallet:', error.message)
        if (!cancelled) {
          setInitError(error)
        }
      }
    }

    // Initialize once
    if (!isInitialized && !initError) {
      initWallet()
    }

    return () => {
      console.log('[WalletProvider.cleanup] Cleaning up wallet provider')
      cancelled = true
    }
  }, [isInitialized, initError])

  return <WalletContext.Provider value={walletRef.current!}>{children}</WalletContext.Provider>
}
