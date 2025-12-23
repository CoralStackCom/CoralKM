import { userProfiles } from '@/lib/user-profiles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import ChatAvatar from '../ChatAvatar'
import { UserProfileSelectorProps } from './UserProfileSelector.interfaces'
import { styles } from './UserProfileSelector.styles'

/**
 * UserProfileSelector Component
 *
 * Displays current user profile and allows switching between
 * saved user profiles inside a modal selector list.
 *
 * @param {UserProfileSelectorProps} props
 */

export function UserProfileSelector({ currentProfile, onProfileChange }: UserProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setIsOpen(true)}>
        <ChatAvatar
          name={currentProfile.displayName}
          picture={currentProfile.displayPicture}
          size={40}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.triggerName}>{currentProfile.displayName}</Text>
        </View>

        <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={userProfiles}
            keyExtractor={p => p.displayName}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onProfileChange(item)
                  setIsOpen(false)
                }}
              >
                <ChatAvatar name={item.displayName} picture={item.displayPicture} size={40} />

                <Text style={styles.itemName}>{item.displayName}</Text>

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
