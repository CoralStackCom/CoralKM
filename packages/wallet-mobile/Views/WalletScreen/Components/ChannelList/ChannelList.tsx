import { AddContactDialog } from '@/components/AddContactDialog'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'

import ChatAvatar from '../ChatAvatar'
import { ChannelListProps } from './ChannelList.interfaces'
import { styles } from './ChannelList.styles'

/**
 * ChannelList component.
 *
 * Renders a list of channels/contacts with their avatar, name, DID,
 * guardian status, and message count. Allows selecting a channel,
 * copying DID to clipboard, and adding new contacts.
 */
export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  onAddChannel,
}) => {
  const DID_REGEX = /^did:[a-z0-9]+:[a-zA-Z0-9.\-_:%]+$/
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newChannelId, setNewChannelId] = useState('')
  const [didError, setDidError] = useState<string | null>(null)

  /**
   * Copies a DID string to the clipboard
   */
  const copyToClipboard = async (value: string) => {
    await Clipboard.setStringAsync(value)
    Alert.alert('Copied!', 'DID copied to clipboard.')
  }

  /**
   * Validates a DID string format
   */
  const isValidDid = (did: string) => {
    return DID_REGEX.test(did)
  }

  /**
   * Handles adding a new channel by DID
   */
  const handleAddChannel = () => {
    const did = newChannelId.trim()

    if (!did) return

    if (!isValidDid(did)) {
      setDidError('Invalid DID address')
      return
    }

    onAddChannel(did)
    setNewChannelId('')
    setDidError(null)
    setIsDialogOpen(false)
  }

  /**
   * Renders each channel item in the FlatList
   */
  const renderChannelItem = ({ item }: { item: typeof channels[number] }) => {
    const isSelected = selectedChannel?.id === item.id
    return (
      <View style={[styles.channelItem, isSelected && styles.channelItemSelected]}>
        <ChatAvatar
          name={item.profile.displayName}
          picture={item.profile.displayPicture}
          size={48}
        />

        <View style={styles.channelInfo}>
          <View style={styles.nameRow}>
            <TouchableOpacity onPress={() => onSelectChannel(item)} style={styles.touchableName}>
              <Text style={styles.nameText}>{item.profile.displayName}</Text>

              {item.supports_guardian && !item.is_guardian && (
                <MaterialCommunityIcons name="shield-outline" size={18} color="#666" />
              )}

              {item.is_guardian && (
                <MaterialCommunityIcons name="shield-check" size={18} color="#666" />
              )}

              <Text style={styles.msgCount}>({item.messages.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(item.id)}>
              <MaterialCommunityIcons name="content-copy" size={16} color="#777" />
            </TouchableOpacity>
          </View>

          <View style={styles.didRow}>
            <Text numberOfLines={1} style={styles.didText}>
              {item.id}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity onPress={() => setIsDialogOpen(true)}>
          <MaterialCommunityIcons name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList data={channels} keyExtractor={item => item.id} renderItem={renderChannelItem} />
      <AddContactDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onAddContact={onAddChannel}
      />
    </View>
  )
}
