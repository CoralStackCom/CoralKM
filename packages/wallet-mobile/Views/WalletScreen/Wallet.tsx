import { DidQrGenerator } from '@/components/DidQrGenerator/DidQrGenerator'
import { styleMessage } from '@/lib/style-messages'
import { useWallet } from '@/providers/wallet'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useCallback, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ChannelList } from './Components/ChannelList'
import ChannelView from './Components/ChannelView'
import { MessageComposer } from './Components/MessageComposer/MessageComposer'
import { UserProfileSelector } from './Components/UserProfileSelector'
import { IChannelMessage } from './wallet.interfaces'
import { styles } from './wallet.style'

export const Wallet: React.FC = () => {
  const { user: currentUser, wallet, channels } = useWallet()
  const [selectedChannelId, setSelectedChannelId] = useState<any>(null)
  const [isMessageDetailsOpen, setIsMessageDetailsOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<IChannelMessage | null>(null)
  const [copied, setCopied] = useState<'did' | 'namespace' | null>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const selectedChannel = selectedChannelId ? channels.get(selectedChannelId) || null : null
  // --- Handlers ---
  const handleChannelSelect = (channel: any) => {
    setSelectedChannelId(channel?.id)
  }
  const handleCopy = useCallback(async (value: string, label: 'did' | 'namespace') => {
    try {
      await Clipboard.setStringAsync(value)
      setCopied(label)

      setTimeout(() => {
        setCopied(null)
      }, 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }, [])

  const handleRotateKeys = useCallback(async () => {
    setIsRotating(true)
    await wallet.rotateKeys?.()
    setTimeout(() => setIsRotating(false), 1000)
  }, [wallet])

  // --- Safe Wrapper ---
  const SafeWrapper = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.safeWrapper}>{children}</View>
  )
  if (!wallet && !currentUser) {
    return (
      <SafeWrapper>
        <View style={styles.container}>
          <Text>Loading wallet...</Text>
        </View>
      </SafeWrapper>
    )
  }
  // --- Main render ---
  if (!selectedChannel) {
    return (
      <SafeWrapper>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <UserProfileSelector
                currentProfile={currentUser}
                onProfileChange={async (profile: any) => {
                  await wallet.updateUserProfile({
                    displayName: profile?.displayName,
                    displayPicture: profile?.displayPicture,
                  })
                }}
              />
            </View>

            <View style={styles.headerRight}>
              <Text style={styles.userDid} numberOfLines={1} ellipsizeMode="middle">
                ({currentUser?.routing_id || currentUser?.mediator_id || 'No DID'})
              </Text>
              <TouchableOpacity
                onPress={handleRotateKeys}
                style={styles.headerButton}
                disabled={isRotating}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#1B5678"
                  style={isRotating ? styles.spinning : {}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowShareModal(true)} style={styles.headerButton}>
                <Ionicons name="share" size={20} color="#1B5678" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCopy(currentUser?.mediator_id || 'No DID', 'did')}
                style={styles.headerButton}
              >
                <Ionicons
                  name={copied === 'did' ? 'checkmark' : 'copy'}
                  size={20}
                  color={copied === 'did' ? '#1B5678' : '#1B5678'}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Channel List */}
          <ChannelList
            channels={Array.from(channels.values())}
            selectedChannel={selectedChannel}
            onSelectChannel={handleChannelSelect}
            onAddChannel={async (did: any) => {
              await wallet.addChannel?.(did)
            }}
          />

          {/* Message Details */}
          <Modal
            visible={isMessageDetailsOpen}
            transparent
            animationType="slide"
            onRequestClose={() => setIsMessageDetailsOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Message Data</Text>
                <ScrollView style={styles.dataContainerScroll}>
                  <Text style={styles.dataText}>
                    {selectedMessage ? JSON.stringify(selectedMessage.message, null, 2) : ''}
                  </Text>
                </ScrollView>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setIsMessageDetailsOpen(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <DidQrGenerator
            did={currentUser?.mediator_id || 'No DID'}
            onClose={() => setShowShareModal(false)}
            visible={showShareModal}
            key={currentUser?.mediator_id}
            userName={currentUser?.displayName}
          />
        </View>
      </SafeWrapper>
    )
  }

  return (
    <SafeWrapper>
      <View style={styles.chatContainer}>
        <ChannelView
          channel={selectedChannel}
          styleMessage={styleMessage}
          selectChannel={setSelectedChannelId}
        />
        <MessageComposer
          currentUser={currentUser}
          selectedChannel={selectedChannel}
          sendMessage={async message => {
            await wallet.sendMessage(message)
          }}
          addGuardian={async guardianDID => {
            await wallet.addGuardian(guardianDID)
          }}
          removeGuardian={async guardianDID => {
            await wallet.removeGuardian(guardianDID)
          }}
        />
      </View>
    </SafeWrapper>
  )
}
