import { Ionicons } from '@expo/vector-icons'
import type { IDIDCommMessage } from '@veramo/did-comm'
import { Text, TouchableOpacity, View } from 'react-native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { MessageComposerProps } from './MessageComposer.interfaces'
import { styles } from './MessageComposer.styles'

/**
 *  MessageComposer Component
 *  Renders the message composer interface within the wallet screen.
 *  Provides functionality to send messages and manage guardianship.
 *
 * @param currentUser - The current user of the wallet
 * @param selectedChannel - The currently selected channel
 * @param sendMessage - Function to send a message
 * @param addGuardian - Function to add a guardian to the channel
 * @param removeGuardian - Function to remove a guardian from the channel
 * @returns
 *
 */
export const MessageComposer: React.FC<MessageComposerProps> = ({
  selectedChannel,
  currentUser,
  sendMessage,
  addGuardian,
  removeGuardian,
}) => {
  const handlePing = () => {
    const didCommMessage: IDIDCommMessage = {
      type: 'https://didcomm.org/trust-ping/2.0/ping',
      id: uuidv4(),
      to: [selectedChannel.id],
      from: currentUser.routing_id || currentUser.mediator_id,
      body: {
        responseRequested: true,
      },
    }
    sendMessage(didCommMessage)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePing} activeOpacity={0.7}>
        <Ionicons name="send" size={16} color="#ffffff" style={styles.icon} />
        <Text style={styles.buttonText}>Ping</Text>
      </TouchableOpacity>

      {selectedChannel.supports_guardian && !selectedChannel.is_guardian && (
        <TouchableOpacity
          style={[styles.button, styles.guardianButton]}
          onPress={() => addGuardian(selectedChannel.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="shield-checkmark" size={16} color="#ffffff" style={styles.icon} />
          <Text style={[styles.buttonText, styles.guardianButtonText]}>Request Guardianship</Text>
        </TouchableOpacity>
      )}

      {selectedChannel.is_guardian && (
        <TouchableOpacity
          style={[styles.button, styles.revokeButton]}
          onPress={() => removeGuardian(selectedChannel.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="shield-outline" size={16} color="#ffffff" style={styles.icon} />
          <Text style={styles.buttonText}>Revoke Guardianship</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
