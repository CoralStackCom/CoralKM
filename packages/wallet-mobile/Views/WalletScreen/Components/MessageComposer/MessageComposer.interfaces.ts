import type { IChannel, IWalletUser } from '@/providers/wallet'
import type { IDIDCommMessage } from '@veramo/did-comm'

export interface MessageComposerProps {
  selectedChannel: IChannel
  currentUser: IWalletUser
  sendMessage: (message: IDIDCommMessage) => void
  addGuardian: (guardianDID: string) => void
  removeGuardian: (guardianDID: string) => void
}
