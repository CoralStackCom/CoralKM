export interface ActionRowProps {
  /** Title of the action row */
  title: string
  /** Optional description below the title */
  description?: string
  /** Optional onPress handler for the action row */
  onPress?: () => void
  /** Optional left icon component */
  leftIcon?: React.ReactNode
  /** Optional right icon component */
  rightIcon?: React.ReactNode
}
