import type { IconSymbolName } from '@/components/ui/icon-symbol'

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
  leftIcon: IconSymbolName
  /** Toggle value (if toggle type) */
  value?: boolean
  /** Callback when toggle changes */
  onValueChange?: (value: boolean) => void
  /** Callback when row is pressed (if action type) */
  onPress?: () => void
  /** Whether the setting toggle is disabled */
  disabled?: boolean
}

export interface PrivacySecurityScreenProps {}
