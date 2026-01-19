import { IWalletUser } from '@/providers/wallet'
import type { IAgentUserProfile } from '@coralkm/core'

export interface UserProfileSelectorProps {
  // The currently selected profile
  currentProfile: IWalletUser | undefined
  // Callback when the user selects a different profile
  onProfileChange: (profile: IAgentUserProfile) => void
}
