import { IChannel, IChannelMessage } from '@/providers/wallet'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ChatAvatar } from './chat-avatar'

interface MessageContent {
  title: string | React.ReactElement
  body: string | React.ReactElement
  color?: string
}

interface ChatMessageProps {
  message: IChannelMessage
  channel: IChannel
  onViewMessage: (message: IChannelMessage) => void
  styleMessage?: (message: IChannelMessage) => MessageContent
}

export function ChatMessage({ message, channel, onViewMessage, styleMessage }: ChatMessageProps) {
  const content = styleMessage
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
          picture={channel.profile.displayPicture}
          size={32}
        />
      )}
      <View style={[styles.messageWrapper, message.is_sent ? styles.alignEnd : styles.alignStart]}>
        <View style={[styles.bubble, { backgroundColor: content.color || bubbleColor }]}>
          {/* Title Bar */}
          <View style={styles.titleBar}>
            <Text style={[styles.titleText, { color: textColor }]}>
              {typeof content.title === 'string' ? content.title : 'Message'}
            </Text>
            <TouchableOpacity onPress={() => onViewMessage(message)}>
              <MaterialCommunityIcons name="eye" size={14} color={textColor} />
            </TouchableOpacity>
          </View>
          {/* Message Content */}
          <View style={styles.bodyContainer}>
            <Text style={[styles.bodyText, { color: textColor }]}>
              {typeof content.body === 'string' ? content.body : JSON.stringify(content.body)}
            </Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'flex-start',
    gap: 8,
  },
  row: { flexDirection: 'row' },
  rowReverse: { flexDirection: 'row-reverse' },
  messageWrapper: {
    flex: 1,
    maxWidth: '80%',
  },
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },
  bubble: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  titleBar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.8,
  },
  bodyContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bodyText: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
})
