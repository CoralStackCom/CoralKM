import type { IconSymbolName } from '../icon-symbol'

export interface ActionRowProps {
  /** Title of the action row */
  title: string
  /** Optional description below the title */
  description?: string
  /** Optional onPress handler for the action row */
  onPress?: () => void
  /** Optional left icon name */
  leftIcon?: IconSymbolName
  /** Optional right icon component */
  rightIcon?: React.ReactNode
  /** Optional color for the icons */
  iconColor?: string
  /**
   * Optional accent color. When set, the left icon is rendered inside a tinted
   * rounded chip using this color (matching the Profile menu treatment).
   */
  chipColor?: string
}
