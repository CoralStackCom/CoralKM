import React from 'react'
import type { Wallet } from './wallet'

/**
 * Context for providing Wallet instance to components
 */
export const WalletContext = React.createContext<Wallet | undefined>(undefined)

/**
 * Hook to use the Wallet context
 * @throws Error if wallet context is not available
 */
export function useWallet(): Wallet {
  const wallet = React.useContext(WalletContext)
  if (!wallet) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return wallet
}
