import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import ChatAvatar from '../ChatAvatar'
import { ChatMessageProps, MessageContent } from './ChatMessage.intrfaces'
import { styles } from './ChatMessage.styles'

/**
 * ChatMessage Component
 *
 * Renders a single message bubble inside the conversation. Supports:
 * - Custom styling via `styleMessage`
 * - Sender/receiver alignment
 * - Avatar for received messages
 * - Formatted timestamp
 * - “View message” inspector button
 *
 * @param {ChatMessageProps} props
 */

export function ChatMessage({ message, channel, onViewMessage, styleMessage }: ChatMessageProps) {
  const content: MessageContent = styleMessage
    ? styleMessage(message)
    : {
        title: message.is_sent ? 'You' : channel.profile.displayName,
        body: JSON.stringify(message.message.body, null, 2),
      }

  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const bubbleColor = message.is_sent ? '#007AFF' : '#E5E5EA'
  const textColor = message.is_sent ? '#fff' : '#000'

  return (
    <View style={[styles.container, message.is_sent ? styles.rowReverse : styles.row]}>
      {!message.is_sent && (
        <ChatAvatar
          name={channel.profile.displayName}
          picture={channel?.profile?.displayPicture}
          size={32}
        />
      )}

      <View style={[styles.messageWrapper, message.is_sent ? styles.alignEnd : styles.alignStart]}>
        <View style={[styles.bubble, { backgroundColor: content.color || bubbleColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.titleText, { color: textColor }]}>
              {typeof content.title === 'string' ? content.title : 'Message'}
            </Text>

            <TouchableOpacity onPress={() => onViewMessage(message)}>
              <MaterialCommunityIcons name="eye" size={14} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={[styles.bodyText, { color: textColor }]}>
              {typeof content.body === 'string'
                ? content.body
                : JSON.stringify(content.body, null, 2)}
            </Text>
          </View>
        </View>

        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  )
}
