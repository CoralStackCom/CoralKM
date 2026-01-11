import type { WalletExportedData } from '@/providers/wallet/wallet'
import type { INamespace } from '@coralkm/core'

export interface RecoverSuccessModalProps {
  recoveredWallet?: {
    key: string
    data: WalletExportedData
    namespace: INamespace
  }
}
