import { User } from '@/types'

export interface SetupUserStepProps {
  // Next Step Label
  nextStep: string
  // Currently authenticated user
  authenticatedUser: Partial<User>
  // Callback when user details are submitted
  onNext: (firstName: string, lastName: string, avatar?: string) => void
}
