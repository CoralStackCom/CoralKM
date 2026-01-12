export interface QuickActionButtonProps {
  /** Label displayed under the icon */
  label: string

  /** Icon name rendered inside the action */
  iconName: string

  /** Background color of the icon container */
  iconBackgroundColor: string

  /** Callback fired when the action is pressed */
  onPress: () => void

  /** Optional press opacity */
  activeOpacity?: number
}
