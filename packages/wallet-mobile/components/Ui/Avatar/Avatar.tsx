import type React from 'react'
import { Image, Text, View } from 'react-native'
import { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './Avatar.interfaces'
import { styles } from './Avatar.styles'

/**
 * Avatar component.
 *
 * Displays a circular container for a user avatar.
 * Can contain an image or fallback content.
 */
export const Avatar: React.FC<AvatarProps> = ({ size = 'md', style, children }) => {
  return <View style={[styles.avatar, styles[`size-${size}`], style]}>{children}</View>
}

/**
 * AvatarImage component.
 *
 * Displays an image inside the Avatar container.
 */
export const AvatarImage: React.FC<AvatarImageProps> = ({ source, alt }) => {
  return <Image source={source} style={styles.image} accessibilityLabel={alt} />
}

/**
 * AvatarFallback component.
 *
 * Displays fallback content inside the Avatar container when no image is provided.
 */
export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children }) => {
  return (
    <View style={styles.fallback}>
      {typeof children === 'string' ? (
        <Text style={styles.fallbackText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}
