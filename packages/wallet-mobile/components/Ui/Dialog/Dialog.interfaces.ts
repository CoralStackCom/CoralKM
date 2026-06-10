/**
 * Dialog component properties
 */
export interface DialogProps {
  /** Whether the dialog is open */
  open: boolean

  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void

  /** Children components inside the dialog */
  children?: React.ReactNode
}

/**
 * DialogContent properties
 */
export interface DialogContentProps {
  /** Content of the dialog */
  children?: React.ReactNode

  /** Whether to show the close button */
  showCloseButton?: boolean
}

/** DialogHeader properties */
export interface DialogHeaderProps {
  children?: React.ReactNode
}

/** DialogTitle properties */
export interface DialogTitleProps {
  children?: React.ReactNode
}

/** DialogDescription properties */
export interface DialogDescriptionProps {
  children?: React.ReactNode
}

/** DialogFooter properties */
export interface DialogFooterProps {
  children?: React.ReactNode
}
