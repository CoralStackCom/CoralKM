import type { IconSymbolName } from '../icon-symbol'

// Component Props Interfaces

export interface SelectableListItem {
  /**
   * Unique key for the item
   */
  key: string
  /**
   *  Label to display for the item
   */
  label: string
  /**
   * Optional icon name for the item
   */
  icon?: IconSymbolName
}

export interface SelectableListProps<T> {
  /**
   *  List of selectable items
   */
  List: SelectableListItem[]
  /**
   *  Currently selected value
   */
  value: string
  /**
   * Callback when selection changes
   */
  onChange: React.Dispatch<React.SetStateAction<T>>
}
