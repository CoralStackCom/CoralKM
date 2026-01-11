import { Ionicons } from '@expo/vector-icons'
import type React from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ChatAvatar from '../ChatAvatar'
import { ChatMessage } from '../ChatMessage'

export default function ChannelView({ channel, styleMessage, selectChannel }: any) {
  const scrollViewRef = useRef<ScrollView>(null)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false)
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false)

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [channel?.messages.length, channel?.id])

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message)
    setIsMessageDrawerOpen(true)
  }

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => selectChannel(null)}>
          <Ionicons name="arrow-back" size={24} color="#333" />
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
          <Ionicons name="information-circle-outline" size={24} color="#666" />
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
                <Ionicons name="close" size={28} color="#333" />
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
                <Ionicons name="close" size={28} color="#333" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  backButton: { padding: 4, marginRight: 4 },
  avatarContainer: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  drawerContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
})
