import { ReactNode } from 'react'

/**
 * HeaderProps
 *
 * Props for the Header component.
 */
export interface HeaderProps {
  /** Title displayed in the center */
  title: string

  /** Show back button on the left */
  showBackButton?: boolean

  /** Callback fired when back button is pressed */
  onBackPress?: () => void

  /** Optional component rendered on the right side */
  rightComponent?: ReactNode
}
