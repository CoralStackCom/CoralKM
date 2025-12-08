import type { IChannel, IWalletUser } from '@/providers/wallet'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { IDIDCommMessage } from '@veramo/did-comm'
import { Text, TouchableOpacity, View } from 'react-native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

interface MessageComposerProps {
  selectedChannel: IChannel
  currentUser: IWalletUser
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
      id: uuidv4(), // FIXED
      to: [selectedChannel.id],
      from: currentUser.routing_id || currentUser.mediator_id,
      body: {
        responseRequested: true,
      },
    }
    sendMessage(didCommMessage)
  }

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: '#e0e0e0', backgroundColor: '#fff' }}>
      {/* Display Current User DID */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
        <Text style={{ fontSize: 12, color: '#444' }}>
          Your DID: {currentUser.routing_id || currentUser.mediator_id}
        </Text>
      </View>

      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#007AFF',
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
          onPress={handlePing}
        >
          <MaterialCommunityIcons name="send" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Ping</Text>
        </TouchableOpacity>

        {selectedChannel.supports_guardian && !selectedChannel.is_guardian && (
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#34C759',
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
            onPress={() => addGuardian(selectedChannel.id)}
          >
            <MaterialCommunityIcons name="shield-plus" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>Guardian</Text>
          </TouchableOpacity>
        )}

        {selectedChannel.is_guardian && (
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#FF3B30',
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
            onPress={() => removeGuardian(selectedChannel.id)}
          >
            <MaterialCommunityIcons name="shield-minus" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>Revoke</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
