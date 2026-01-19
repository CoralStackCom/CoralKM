import type { WalletExportedData } from '@/providers/wallet/wallet'
import type { INamespace } from '@coralkm/core'

export interface RecoverSuccessModalProps {
  // The recovered wallet information
  recoveredWallet?: {
    // The recovery  key used
    key: string
    // The exported data of the wallet
    data: WalletExportedData
    // The namespace information
    namespace: INamespace
  }
}
