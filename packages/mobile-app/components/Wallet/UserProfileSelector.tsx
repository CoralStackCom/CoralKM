import { userProfiles } from '@/lib/user-profiles'
import type { IAgentUserProfile } from '@coralkm/core'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { ChatAvatar } from './chat-avatar'

interface UserProfileSelectorProps {
  currentProfile: IAgentUserProfile
  onProfileChange: (profile: IAgentUserProfile) => void
}

export function UserProfileSelector({ currentProfile, onProfileChange }: UserProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          gap: 12,
        }}
      >
        <ChatAvatar
          name={currentProfile.displayName}
          picture={
            currentProfile.displayPicture
              ? `data:image/png;base64,${currentProfile.displayPicture}`
              : undefined
          }
          size={20}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{currentProfile.displayName}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
            }}
          >
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={userProfiles}
            keyExtractor={item => item.displayName}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onProfileChange(item)
                  setIsOpen(false)
                }}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <ChatAvatar name={item.displayName} picture={item.displayPicture} size={40} />
                <Text style={{ fontSize: 14, fontWeight: '500', flex: 1 }}>{item.displayName}</Text>
                {currentProfile.displayName === item.displayName && (
                  <MaterialCommunityIcons name="check" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  )
}
