import React from 'react'

import { WalletContext } from './context'

/**
 * Hook to access the Wallet instance from context
 *
 * @returns The current Wallet instance
 */
export function useWallet() {
  const wallet = React.useContext(WalletContext)
  if (!wallet) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  // Subscribe to wallet updates
  const snapshot = React.useSyncExternalStore(
    wallet.subscribe.bind(wallet),
    wallet.getSnapshot.bind(wallet)
  )

  return {
    wallet,
    user: snapshot.user,
    channels: snapshot.channels,
    namespace: snapshot.namespace,
    walletKey: snapshot.walletKey,
    backupData: snapshot.backupData,
    restoredData: snapshot.restoredData,
  }
}
