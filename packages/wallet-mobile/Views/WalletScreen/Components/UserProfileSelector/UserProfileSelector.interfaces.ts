import { IWalletUser } from '@/providers/wallet'
import type { IAgentUserProfile } from '@coralkm/core'

export interface UserProfileSelectorProps {
  currentProfile: IWalletUser | undefined
  onProfileChange: (profile: IAgentUserProfile) => void
}
