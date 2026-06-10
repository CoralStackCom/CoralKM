import { palette } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import ChatAvatar from '../ChatAvatar'
import { ChatMessage } from '../ChatMessage'
import { ChannelViewProps } from './ChannelView.interfaces'
import { styles } from './ChannelView.styles'

/**
 * ChannelView component.
 *
 * Displays a single channel's chat messages with a header showing
 * the contact's avatar and name. Includes modals for viewing
 * raw message data and channel info.
 */
export const ChannelView: React.FC<ChannelViewProps> = ({
  channel,
  styleMessage,
  selectChannel,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false)
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false)

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [channel?.messages.length, channel?.id])

  /**
   * Opens the message detail drawer for a specific message
   */
  const handleViewMessage = (message: any) => {
    setSelectedMessage(message)
    setIsMessageDrawerOpen(true)
  }

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => selectChannel(null)}>
          <Ionicons name="arrow-back" size={22} color={palette.navy} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <ChatAvatar
            name={channel?.profile?.displayName}
            picture={channel?.profile.displayPicture}
            size={40}
          />
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {channel?.profile?.displayName}
        </Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => setIsChannelDrawerOpen(true)}>
          <Ionicons name="information-circle-outline" size={22} color={palette.navy} />
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {channel?.messages?.map((message: any) => (
          <ChatMessage
            key={message?.message?.id}
            message={message}
            channel={channel}
            onViewMessage={handleViewMessage}
            styleMessage={styleMessage}
          />
        ))}
      </ScrollView>

      {/* Message Drawer Modal */}
      <Modal
        visible={isMessageDrawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsMessageDrawerOpen(false)
          setTimeout(() => setSelectedMessage(null), 300)
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Message Data</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsMessageDrawerOpen(false)
                  setTimeout(() => setSelectedMessage(null), 300)
                }}
              >
                <Ionicons name="close" size={26} color={palette.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.drawerContent}>
              {selectedMessage && (
                <View style={styles.codeBlock}>
                  <Text style={styles.codeText}>
                    {JSON.stringify(selectedMessage.message, null, 2)}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Channel Info Drawer Modal */}
      <Modal
        visible={isChannelDrawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChannelDrawerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Channel Info</Text>
              <TouchableOpacity onPress={() => setIsChannelDrawerOpen(false)}>
                <Ionicons name="close" size={26} color={palette.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.drawerContent}>
              {channel && (
                <>
                  <Text style={styles.sectionTitle}>DID:</Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeText}>{JSON.stringify(channel?.did, null, 2)}</Text>
                  </View>
                  {channel?.routing_did && (
                    <>
                      <Text style={styles.sectionTitle}>Routing DID:</Text>
                      <View style={styles.codeBlock}>
                        <Text style={styles.codeText}>{channel?.routing_did}</Text>
                      </View>
                    </>
                  )}
                  <Text style={styles.sectionTitle}>Supported Features:</Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeText}>
                      {JSON.stringify(channel?.features, null, 2)}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ChannelView
