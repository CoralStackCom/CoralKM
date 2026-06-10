/**
 * Drawer component properties
 */
export interface DrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean

  /** Callback function to close the drawer */
  onClose: () => void

  /** Title text displayed in the drawer header */
  title: string

  /** Children components inside the drawer */
  children?: React.ReactNode
}
