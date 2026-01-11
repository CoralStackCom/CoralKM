export interface AvatarUploadProps {
  /** URI of the current avatar image */
  uri: string

  /** Size of the avatar (width and height) */
  size?: number

  /** Callback function when the image changes */
  onImageChange?: (uri: string) => void

  /** Whether the avatar is editable */
  editable?: boolean
}
