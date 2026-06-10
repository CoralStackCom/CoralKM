/**
 * Component Properties
 */
export interface ShareDIDModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean

  /**
   * Callback function to close the modal
   */
  onClose: () => void

  /**
   * The DID to share
   */
  did: string

  /**
   * Optional name of the user
   */
  userName?: string
}
