export interface AccordionItemProps {
  /** Title displayed in the accordion header */
  title: string

  /** Content shown when the item is expanded */
  content: string

  /** Whether the item is currently expanded */
  expanded: boolean

  /** Callback fired when the header is pressed */
  onToggle: () => void

  /** Optional press opacity */
  activeOpacity?: number

  /** Show divider below the item */
  showDivider?: boolean
}
