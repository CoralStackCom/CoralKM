/**
 * Component Properties
 */
export interface AddContactDialogProps {
  /**
   * Whether the add contact dialog is open
   */
  isDialogOpen: boolean

  /**
   * Callback function to control the dialog open state
   */
  setIsDialogOpen: (open: boolean) => void

  /**
   * Callback function to add a new contact using DID
   */
  onAddContact: (did: string) => void
}
