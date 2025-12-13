import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { IDIDCommMessage } from '@veramo/did-comm'
import { Text, TouchableOpacity, View } from 'react-native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { MessageComposerProps } from './MessageComposer.interfaces'
import { styles } from './MessageComposer.style'

/**
 * MessageComposer Component
 *
 * Handles channel interactions including:
 * - Sending a DIDComm Ping message
 * - Adding / removing a guardian for the channel
 * - Displaying the current user's DID
 *
 * @param {MessageComposerProps} props
 */

export function MessageComposer({
  selectedChannel,
  currentUser,
  sendMessage,
  addGuardian,
  removeGuardian,
}: MessageComposerProps) {
  const handlePing = () => {
    const didCommMessage: IDIDCommMessage = {
      type: 'https://didcomm.org/trust-ping/2.0/ping',
      id: uuidv4(),
      to: [selectedChannel.id],
      from: currentUser.routing_id || currentUser.mediator_id,
      body: { responseRequested: true },
    }

    sendMessage(didCommMessage)
  }

  return (
    <View style={styles.container}>
      {/* User DID */}
      <View style={styles.userDidSection}>
        <Text style={styles.userDidText}>
          Your DID: {currentUser.routing_id || currentUser.mediator_id}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        {/* Ping */}
        <TouchableOpacity style={[styles.button, styles.pingButton]} onPress={handlePing}>
          <MaterialCommunityIcons name="send" size={16} color="#fff" />
          <Text style={styles.buttonText}>Ping</Text>
        </TouchableOpacity>

        {/* Guardian */}
        {selectedChannel.supports_guardian && !selectedChannel.is_guardian && (
          <TouchableOpacity
            style={[styles.button, styles.guardianButton]}
            onPress={() => addGuardian(selectedChannel.id)}
          >
            <MaterialCommunityIcons name="shield-plus" size={16} color="#fff" />
            <Text style={styles.guardianText}>Guardian</Text>
          </TouchableOpacity>
        )}

        {/* Revoke Guardian */}
        {selectedChannel.is_guardian && (
          <TouchableOpacity
            style={[styles.button, styles.revokeButton]}
            onPress={() => removeGuardian(selectedChannel.id)}
          >
            <MaterialCommunityIcons name="shield-remove" size={16} color="#fff" />
            <Text style={styles.revokeText}>Revoke</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
