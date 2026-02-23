import React from 'react'

import { createLogger } from '@/utils/logger'

import { WalletContext } from './context'
import { Wallet } from './wallet'

const log = createLogger('WalletProvider')

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
  log.info('Initializing', { gatewayDID })

  // Keep Wallet instance stable across re-renders and StrictMode re-mounts
  const walletRef = React.useRef<Wallet | null>(null)
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [initError, setInitError] = React.useState<Error | null>(null)

  if (walletRef.current === null) {
    // Create only once per provider lifetime
    log.info('Creating Wallet instance')
    walletRef.current = new Wallet(gatewayDID)
  }

  React.useEffect(() => {
    let cancelled = false
    const initWallet = async () => {
      log.info('Starting wallet initialization')
      try {
        await walletRef.current!.init()
        if (!cancelled) {
          log.info('Wallet initialized successfully')
          setIsInitialized(true)
          setInitError(null)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        log.error('Failed to initialize wallet', error)
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
      log.debug('Cleaning up wallet provider')
      cancelled = true
    }
  }, [isInitialized, initError])

  return <WalletContext.Provider value={walletRef.current!}>{children}</WalletContext.Provider>
}
