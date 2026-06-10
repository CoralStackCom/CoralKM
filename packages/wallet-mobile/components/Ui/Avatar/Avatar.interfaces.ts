/**
 * Avatar component properties
 */
export interface AvatarProps {
  /** Size of the avatar: 'sm', 'md', 'lg' */
  size?: 'sm' | 'md' | 'lg'

  /** Custom style for the avatar container */
  style?: any

  /** Optional children elements */
  children?: React.ReactNode
}

/**
 * AvatarImage component properties
 */
export interface AvatarImageProps {
  /** Image source */
  source: any

  /** Accessibility label / alt text */
  alt?: string
}

/**
 * AvatarFallback component properties
 */
export interface AvatarFallbackProps {
  /** Fallback content (string or ReactNode) */
  children?: React.ReactNode
}
