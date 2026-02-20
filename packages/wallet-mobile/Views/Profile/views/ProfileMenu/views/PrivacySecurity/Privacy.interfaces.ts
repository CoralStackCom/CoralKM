/**
 * Interfaces for PrivacySecurityScreen component.
 *
 * Defines the privacy setting item structure for
 * config-driven rendering.
 */
export interface PrivacySettingItem {
  /** Display title for the setting */
  title: string
  /** Description text shown below the title */
  description: string
  /** Icon name from the icon set */
  leftIcon: string
  /** Toggle value (if toggle type) */
  value?: boolean
  /** Callback when toggle changes */
  onValueChange?: (value: boolean) => void
  /** Callback when row is pressed (if action type) */
  onPress?: () => void
}

export interface PrivacySecurityScreenProps {}
