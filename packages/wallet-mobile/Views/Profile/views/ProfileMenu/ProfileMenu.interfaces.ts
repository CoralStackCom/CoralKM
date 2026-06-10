import type { IconSymbolName } from '@/components/ui/icon-symbol'

/** A single tappable row in the profile menu. */
export interface MenuItem {
  /** Icon shown in the colored chip. */
  icon: IconSymbolName
  /** Primary label. */
  label: string
  /** Short supporting description. */
  description: string
  /** Accent color for the icon chip. */
  color: string
  /** Action to perform on press. */
  onPress: () => void
}

/** A titled group of menu items. */
export interface MenuSection {
  /** Section heading. */
  title: string
  /** Items in the section. */
  items: MenuItem[]
}
