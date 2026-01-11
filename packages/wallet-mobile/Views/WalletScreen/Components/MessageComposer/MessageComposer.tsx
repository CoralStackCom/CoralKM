import { Ionicons } from '@expo/vector-icons'
import type { IDIDCommMessage } from '@veramo/did-comm'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

interface MessageComposerProps {
  selectedChannel: any
  currentUser: any
  sendMessage: (message: IDIDCommMessage) => void
  addGuardian: (guardianDID: string) => void
  removeGuardian: (guardianDID: string) => void
}

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
          <Ionicons name="shield-checkmark" size={16} color="#000000" style={styles.icon} />
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

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 78,
    paddingTop: 16,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    marginRight: 6,
  },
  guardianButton: {
    backgroundColor: '#22c55e',
  },
  guardianButtonText: {
    color: '#000000',
  },
  revokeButton: {
    backgroundColor: '#ef4444',
  },
})
