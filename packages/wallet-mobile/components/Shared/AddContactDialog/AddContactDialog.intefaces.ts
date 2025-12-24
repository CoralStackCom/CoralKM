export interface AddContactDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  onAddContact: (did: string) => void
}
