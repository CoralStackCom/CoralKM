import { IChannel, IChannelMessage } from '@/providers/wallet'
import type React from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ChatAvatar } from './chat-avatar'
import { ChatMessage } from './ChatMessage'

interface ChannelViewProps {
  channel: IChannel | null
  styleMessage?: (message: IChannelMessage) => {
    title: string | React.ReactElement
    body: string | React.ReactElement
  }
}

export function ChannelView({ channel, styleMessage }: ChannelViewProps) {
  const flatListRef = useRef<FlatList>(null)
  const [selectedMessage, setSelectedMessage] = useState<IChannelMessage | null>(null)
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false)
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false)

  const handleViewMessage = (message: IChannelMessage) => {
    setSelectedMessage(message)
    setIsMessageDrawerOpen(true)
  }

  useLayoutEffect(() => {
    if (channel?.messages.length) {
      // Scroll to the last message
      flatListRef.current?.scrollToEnd({ animated: true })
    }
  }, [channel?.messages.length, channel?.id])

  if (!channel) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Text style={{ fontSize: 16, color: '#999' }}>Select a contact to start messaging</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Chat Header */}
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <ChatAvatar
          name={channel.profile.displayName}
          picture={channel.profile.displayPicture}
          size={40}
        />
        <Text style={{ flex: 1, fontWeight: '600', fontSize: 16, marginLeft: 12 }}>
          {channel.profile.displayName}
        </Text>
        <TouchableOpacity onPress={() => setIsChannelDrawerOpen(true)}>
          <Text style={{ color: '#007AFF', fontWeight: '600' }}>Info</Text>
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <FlatList
        ref={flatListRef}
        data={channel.messages}
        keyExtractor={item => item.message.id}
        renderItem={({ item }) => (
          <ChatMessage
            message={item}
            channel={channel}
            onViewMessage={handleViewMessage}
            styleMessage={styleMessage}
          />
        )}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#999' }}>No messages yet</Text>
          </View>
        }
      />

      {/* Message Details Modal */}
      <Modal
        visible={isMessageDrawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMessageDrawerOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
            }}
            onPress={() => setIsMessageDrawerOpen(false)}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
          <ScrollView style={{ flex: 1, padding: 16 }}>
            {selectedMessage && (
              <Text
                style={{
                  fontSize: 10,
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 8,
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(selectedMessage.message, null, 2)}
              </Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Channel Info Modal */}
      <Modal
        visible={isChannelDrawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChannelDrawerOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
            }}
            onPress={() => setIsChannelDrawerOpen(false)}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
          <ScrollView style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 8 }}>DID:</Text>
            <Text
              style={{
                fontSize: 10,
                backgroundColor: '#f5f5f5',
                padding: 12,
                borderRadius: 8,
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(channel.did, null, 2)}
            </Text>
            {channel.routing_did && (
              <>
                <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 8 }}>
                  Routing DID:
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    backgroundColor: '#f5f5f5',
                    padding: 12,
                    borderRadius: 8,
                    fontFamily: 'monospace',
                  }}
                >
                  {channel.routing_did}
                </Text>
              </>
            )}
            <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 8 }}>
              Supported Features:
            </Text>
            <Text
              style={{
                fontSize: 10,
                backgroundColor: '#f5f5f5',
                padding: 12,
                borderRadius: 8,
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(channel.features, null, 2)}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  )
}
