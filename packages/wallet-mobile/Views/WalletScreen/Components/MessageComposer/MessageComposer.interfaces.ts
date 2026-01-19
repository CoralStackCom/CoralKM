import type { IChannel, IWalletUser } from '@/providers/wallet'
import type { IDIDCommMessage } from '@veramo/did-comm'

export interface MessageComposerProps {
  // The currently selected channel
  selectedChannel: IChannel
  // The current user of the wallet
  currentUser: IWalletUser
  // Function to send a message
  sendMessage: (message: IDIDCommMessage) => void
  // Function to add a guardian to the channel
  addGuardian: (guardianDID: string) => void
  // Function to remove a guardian from the channel
  removeGuardian: (guardianDID: string) => void
}
