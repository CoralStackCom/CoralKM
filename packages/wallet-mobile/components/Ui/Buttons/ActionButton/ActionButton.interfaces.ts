export interface ActionButtonProps {
  /** Button label text */
  label: string

  /** Callback fired when the button is pressed */
  onPress: () => void

  /** Optional press opacity */
  activeOpacity?: number

  /** Disable the button interaction */
  disabled?: boolean
}
