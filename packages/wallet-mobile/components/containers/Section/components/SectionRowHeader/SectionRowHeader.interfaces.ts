import type { IconSymbolName } from '@/components/ui/icon-symbol'

export interface SectionRowHeaderProps {
  /** Icon name displayed before the title */
  iconName: IconSymbolName

  /** Title text of the section */
  title: string

  /** Optional icon size */
  iconSize?: number

  /** Optional icon color */
  iconColor?: string
}
