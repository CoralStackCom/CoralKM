/**
 * Props for DropdownMenu root component
 */
export interface DropdownMenuProps {
  children?: React.ReactNode
}

/**
 * Props for DropdownMenuTrigger component
 */
export interface DropdownMenuTriggerProps {
  /** Render trigger as a child element */
  asChild?: boolean
  children?: React.ReactNode
}

/**
 * Props for DropdownMenuContent component
 */
export interface DropdownMenuContentProps {
  children?: React.ReactNode
}

/**
 * Props for DropdownMenuItem component
 */
export interface DropdownMenuItemProps {
  /** Callback fired when item is pressed */
  onPress?: () => void
  children?: React.ReactNode
  /** Visual variant of the item */
  variant?: 'default' | 'destructive'
}

/**
 * Internal dropdown context
 */
export interface DropdownContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}
