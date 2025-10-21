import React from 'react'

import { WalletContext } from './context'
import { Wallet } from './wallet'

/**
 * Provider component to supply the Wallet instance via context
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
  // Keep Wallet instance stable across re-renders and StrictMode re-mounts
  const walletRef = React.useRef<Wallet | null>(null)
  const [isInitialized, setIsInitialized] = React.useState(false)

  if (walletRef.current === null) {
    // Create only once per provider lifetime
    walletRef.current = new Wallet(gatewayDID)
  }

  React.useEffect(() => {
    let cancelled = false
    const initWallet = async () => {
      try {
        await walletRef.current!.init()
        if (!cancelled) setIsInitialized(true)
      } catch (err) {
        console.error('Failed to initialize wallet:', err)
      }
    }

    // Initialize once
    if (!isInitialized) initWallet()

    return () => {
      cancelled = true
    }
  }, [isInitialized])

  return <WalletContext.Provider value={walletRef.current!}>{children}</WalletContext.Provider>
}
