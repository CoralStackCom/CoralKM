import type { IChannel } from '@/providers/wallet'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { ChatAvatar } from './chat-avatar'

interface ChannelListProps {
  channels: IChannel[]
  selectedChannel: IChannel | null
  onSelectChannel: (channel: IChannel) => void
  onAddChannel: (did: string) => void
}

export function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  onAddChannel,
  placeholder,
  value,
  onChangeText,
  handleAddChannel,
}: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const copyToClipboard = async (value: string) => {
    await Clipboard.setStringAsync(value)
    Alert.alert('Copied!', 'DID copied to clipboard.')
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Contacts</Text>
        <TouchableOpacity onPress={() => setIsDialogOpen(true)}>
          <MaterialCommunityIcons name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <FlatList
        data={channels}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectChannel(item)}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: selectedChannel?.id === item.id ? '#f0f0f0' : '#fff',
              borderBottomWidth: 1,
              borderBottomColor: '#f5f5f5',
            }}
          >
            <ChatAvatar
              name={item.profile.displayName}
              picture={item.profile.displayPicture}
              size={48}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              {/* FIRST ROW – Name + Guardian Status + messages */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: '600', fontSize: 14, flex: 1 }}>
                  {item.profile.displayName}
                </Text>

                {item.supports_guardian && !item.is_guardian && (
                  <MaterialCommunityIcons name="shield-outline" size={18} color="#666" />
                )}

                {item.is_guardian && (
                  <MaterialCommunityIcons name="shield-check" size={18} color="#666" />
                )}

                <Text style={{ fontSize: 12, color: '#999', marginLeft: 6 }}>
                  ({item.messages.length})
                </Text>
              </View>

              {/* SECOND ROW – DID + Copy button */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 2,
                  alignItems: 'center',
                }}
              >
                <Text numberOfLines={1} style={{ fontSize: 12, color: '#666', flex: 1 }}>
                  {item.id}
                </Text>
                <TouchableOpacity onPress={() => copyToClipboard(item.id)}>
                  <MaterialCommunityIcons name="content-copy" size={16} color="#777" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Add Channel Modal */}
      {/* <Modal
        visible={isDialogOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDialogOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Add New Contact</Text>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
              Enter the DID URI of the contact
            </Text>
          </View>

          <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
            <TextInput
              placeholder="Contact DID"
              value={value}
              onChangeText={onChangeText}
              placeholderTextColor="#999"
              style={{
                borderWidth: 1,
                borderColor: '#e0e0e0',
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
              autoFocus
            />

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => setIsDialogOpen(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: '#007AFF',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                disabled={!value.trim()}
                onPress={handleAddChannel}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal> */}
    </View>
  )
}
