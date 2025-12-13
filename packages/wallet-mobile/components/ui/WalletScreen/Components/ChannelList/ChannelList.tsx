import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import ChatAvatar from '../ChatAvatar'
import { styles } from './ChannelList.style'

/**
 * ChannelList Component
 *
 * Renders a list of channels/contacts with their avatar, name, DID, guardian status,
 * and message count. Allows selecting a channel and copying DID to clipboard.
 *
 * @param {Object} props - Component props
 * @param {Array} props.channels - List of channel objects
 * @param {Object|null} props.selectedChannel - Currently selected channel
 * @param {Function} props.onSelectChannel - Called when a channel is selected
 * @param {Function} props.onAddChannel - (unused)
 * @param {string} props.placeholder - (unused)
 * @param {string} props.value - (unused)
 * @param {Function} props.onChangeText - (unused)
 * @param {Function} props.handleAddChannel - (unused)
 */
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
  /**
   * Copies text to clipboard with a success alert.
   * @param {string} value - Text to copy.
   */
  const copyToClipboard = async (value: string) => {
    await Clipboard.setStringAsync(value)
    Alert.alert('Copied!', 'DID copied to clipboard.')
  }

  /**
   * Renders each channel item in the FlatList.
   */
  const renderChannelItem = ({ item }: any) => {
    const isSelected = selectedChannel?.id === item.id

    return (
      <TouchableOpacity
        onPress={() => onSelectChannel(item)}
        style={[styles.channelItem, isSelected && styles.channelItemSelected]}
      >
        <ChatAvatar
          name={item.profile.displayName}
          picture={item.profile.displayPicture}
          size={48}
        />

        <View style={styles.channelInfo}>
          {/* FIRST ROW */}
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{item.profile.displayName}</Text>

            {item.supports_guardian && !item.is_guardian && (
              <MaterialCommunityIcons name="shield-outline" size={18} color="#666" />
            )}

            {item.is_guardian && (
              <MaterialCommunityIcons name="shield-check" size={18} color="#666" />
            )}

            <Text style={styles.msgCount}>({item.messages.length})</Text>
          </View>

          {/* SECOND ROW */}
          <View style={styles.didRow}>
            <Text numberOfLines={1} style={styles.didText}>
              {item.id}
            </Text>
            <TouchableOpacity onPress={() => copyToClipboard(item.id)}>
              <MaterialCommunityIcons name="content-copy" size={16} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {/* Channel List */}
      <FlatList data={channels} keyExtractor={item => item.id} renderItem={renderChannelItem} />
    </View>
  )
}
