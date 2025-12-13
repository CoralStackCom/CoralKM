import type { IAgentUserProfile } from '@coralkm/core'

export interface UserProfileSelectorProps {
  currentProfile: IAgentUserProfile
  onProfileChange: (profile: IAgentUserProfile) => void
}
