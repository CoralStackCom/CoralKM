import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { ChannelViewProps, IChannelMessage } from './ChannelView.interface'
import { styles } from './ChannelView.style'

/**
 * ChannelView Component
 *
 * Displays a list of messages inside a channel. Handles highlighting
 * the selected message and triggers a callback when a message is pressed.
 *
 * @param {Object} props - Component props
 * @param {Object|undefined} props.channel - Channel object containing message list
 * @param {Array<Object>} props.channel.messages - Array of message objects
 * @param {Object|null} props.selectedMessage - Currently selected message
 * @param {Function} props.onMessagePress - Callback when a message is pressed
 *
 * @example
 * <ChannelView
 *   channel={channel}
 *   selectedMessage={selectedMessage}
 *   onMessagePress={setSelectedMessage}
 * />
 */


const ChannelView: React.FC<ChannelViewProps> = ({ channel, selectedMessage, onMessagePress }) => {
  const renderItem = ({ item }: { item: IChannelMessage }) => {
    const isSelected = selectedMessage?.message?.id === item.message.id

    return (
      <TouchableOpacity
        style={[styles.messageContainer, isSelected && styles.selectedMessage]}
        onPress={() => onMessagePress(item)}
      >
        <Text style={styles.messageText}>{item.message.message}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={channel?.messages ?? []}
        keyExtractor={item => item.message.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export default ChannelView
