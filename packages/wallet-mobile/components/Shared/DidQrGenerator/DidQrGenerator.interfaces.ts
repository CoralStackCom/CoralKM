export interface ShareDIDModalProps {
  visible: boolean
  onClose: () => void
  did: string
  userName?: string
}