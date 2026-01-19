import React from 'react'
import { Image, Text, View } from 'react-native'
import { ChatAvatarProps } from './ChatAvatar.interface'
import { styles } from './ChatAvatar.style'

/**
 * ChatAvatar Component
 *
 * Renders a circular avatar. Displays an image if a base64 picture is provided,
 * otherwise generates a colored background with the first initial of the name.
 * The component adapts its size dynamically based on the `size` prop.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Full name used to extract initials and background color
 * @param {string} [props.picture] - Optional base64-encoded image (without header)
 * @param {number} [props.size=48] - Diameter of the avatar in pixels
 *
 * @example
 * <ChatAvatar name="Alice Doe" />
 *
 * @example
 * <ChatAvatar name="Bob" size={64} picture={base64String} />
 */

export const ChatAvatar: React.FC<ChatAvatarProps> = ({ name, picture, size = 48 }) => {
  const initials = name?.charAt(0)?.toUpperCase()

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  const bgColor = colors[name?.charCodeAt(0) % colors.length]

  return (
    <View style={styles(size, bgColor).container}>
      {picture ? (
        <Image source={{ uri: `data:image/png;base64,${picture}` }} style={styles(size).image} />
      ) : (
        <Text style={styles(size).initials}>{initials}</Text>
      )}
    </View>
  )
}
export default ChatAvatar
