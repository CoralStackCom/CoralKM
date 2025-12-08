import { ChannelView } from '@/components/Wallet/ChannelView'
import { useWallet } from '@/providers/wallet'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useCallback, useState } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { ChannelList } from '../../../components/Wallet/ChannelList'
import { MessageComposer } from '../../../components/Wallet/MessageComposer'
import { UserProfileSelector } from '../../../components/Wallet/UserProfileSelector'

interface IChannel {
  id: string
  profile: {
    displayName: string
    displayPicture?: string
  }
  messages: IChannelMessage[]
  did?: string
  routing_did?: string
  routing_id?: string
  mediator_id?: string
  features?: string[]
  supports_guardian?: boolean
  is_guardian?: boolean
}

interface IChannelMessage {
  id: string
  message: {
    id: string
    body: any
  }
  is_sent: boolean
  timestamp?: number
}

interface UserProfile {
  displayName: string
  displayPicture?: string
  routing_id: string
  mediator_id: string
  routing_did?: any
  mediator_did?: any
}

const { height: screenHeight } = Dimensions.get('window')

export default function ChatScreen() {
  const { user: currentUser, wallet, namespace, walletKey, backupData, restoredData } = useWallet()
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [channels, setChannels] = useState<IChannel[]>([])
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false)
  const [newChannelId, setNewChannelId] = useState('')
  const [isMessageDetailsOpen, setIsMessageDetailsOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<IChannelMessage | null>(null)
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false)
  const [copied, setCopied] = useState<'did' | 'namespace' | null>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [activeTab, setActiveTab] = useState<'wallet' | 'identifiers'>('wallet')

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || null

  // --- Handlers ---

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

  const handleAddChannel = () => {
    if (!newChannelId.trim()) return
    const newChannel: IChannel = {
      id: newChannelId,
      profile: { displayName: newChannelId.substring(0, 20) },
      messages: [],
      did: newChannelId,
    }
    setChannels(prev => [...prev, newChannel])
    setSelectedChannelId(newChannelId)
    setNewChannelId('')
    setIsAddChannelModalOpen(false)
    wallet.addChannel?.(newChannelId)
  }

  const handleViewMessage = (message: IChannelMessage) => {
    setSelectedMessage(message)
    setIsMessageDetailsOpen(true)
  }

  // --- Safe Wrapper ---
  const SafeWrapper = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.safeWrapper}>{children}</View>
  )

  // --- Main render ---
  if (!selectedChannel) {
    return (
      <SafeWrapper>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {currentUser ? (
                <UserProfileSelector
                  currentProfile={currentUser}
                  onProfileChange={async profile => {
                    await wallet.updateUserProfile({
                      displayName: profile.displayName,
                      displayPicture: profile.displayPicture,
                    })
                    console.log(currentUser.displayName, 'profile changed')
                  }}
                />
              ) : null}
              <Text style={styles.userDid} numberOfLines={1}>
                ({currentUser?.mediator_id || currentUser?.routing_id || 'No DID'})
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={handleRotateKeys}
                style={styles.headerButton}
                disabled={isRotating}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#007AFF"
                  style={isRotating ? styles.spinning : {}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsUserDrawerOpen(true)}
                style={styles.headerButton}
              >
                <Ionicons name="information-circle" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleCopy(currentUser?.routing_id || currentUser?.mediator_id || '', 'did')
                }
                style={styles.headerButton}
              >
                <Ionicons
                  name={copied === 'did' ? 'checkmark' : 'copy'}
                  size={20}
                  color={copied === 'did' ? '#10B981' : '#007AFF'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.userDid} numberOfLines={1}>
              ({currentUser?.mediator_id || currentUser?.routing_id || 'No DID'})
            </Text>
          </View>
          {/* Channel List */}
          <ChannelList
            channels={channels}
            selectedChannelId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
            handleAddChannel={handleAddChannel}
            placeholder="Contact DID"
            value={newChannelId}
            onChangeText={setNewChannelId}
            onAddChannel={() => setIsAddChannelModalOpen(true)}
          />

          {/* Add Channel Modal */}
          <Modal
            visible={isAddChannelModalOpen}
            transparent
            animationType="slide"
            onRequestClose={() => setIsAddChannelModalOpen(false)}
          >
            <View
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
              }}
            >
              <Text style={styles.modalTitle}>Add New Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Contact DID"
                value={newChannelId}
                onChangeText={setNewChannelId}
                placeholderTextColor="#999"
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline]}
                  onPress={() => setIsAddChannelModalOpen(false)}
                >
                  <Text style={styles.buttonTextOutline}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, !newChannelId.trim() && styles.buttonDisabled]}
                  onPress={handleAddChannel}
                  disabled={!newChannelId.trim()}
                >
                  <Text style={styles.buttonText}>Add Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* User Info Drawer */}
          <Modal
            visible={isUserDrawerOpen}
            transparent
            animationType="slide"
            onRequestClose={() => setIsUserDrawerOpen(false)}
          >
            <View style={styles.drawerOverlay}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
                <View style={styles.drawerHeader}>
                  <Text style={styles.drawerTitle}>User Info</Text>
                  <TouchableOpacity onPress={() => setIsUserDrawerOpen(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsList}>
                  <TouchableOpacity
                    style={[styles.tabTrigger, activeTab === 'wallet' && styles.tabTriggerActive]}
                    onPress={() => setActiveTab('wallet')}
                  >
                    <Text style={[styles.tabText, activeTab === 'wallet' && styles.tabTextActive]}>
                      Wallet
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabTrigger,
                      activeTab === 'identifiers' && styles.tabTriggerActive,
                    ]}
                    onPress={() => setActiveTab('identifiers')}
                  >
                    <Text
                      style={[styles.tabText, activeTab === 'identifiers' && styles.tabTextActive]}
                    >
                      Identifiers
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.tabContentScroll}>
                  {activeTab === 'wallet' && (
                    <View style={styles.infoSection}>
                      <View style={styles.infoHeader}>
                        <Text style={styles.infoTitle}>Wallet Namespace</Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleCopy(JSON.stringify(namespace, null, 2), 'namespace')
                          }
                        >
                          <Ionicons
                            name={copied === 'namespace' ? 'checkmark' : 'copy'}
                            size={18}
                            color={copied === 'namespace' ? '#10B981' : '#007AFF'}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.dataTextLarge}>{JSON.stringify(namespace, null, 2)}</Text>
                      <Text style={[styles.infoTitle, { marginTop: 16 }]}>
                        Wallet Data Encryption Key
                      </Text>
                      <Text style={styles.dataTextLarge}>{walletKey}</Text>
                      <Text style={[styles.infoTitle, { marginTop: 16 }]}>Wallet Data</Text>
                      <Text style={styles.dataTextLarge}>
                        {JSON.stringify(backupData, null, 2)}
                      </Text>
                    </View>
                  )}

                  {activeTab === 'identifiers' && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoTitle}>Routing DID</Text>
                      <Text style={styles.dataTextLarge}>
                        {JSON.stringify(currentUser?.routing_did, null, 2) || 'N/A'}
                      </Text>
                      <Text style={styles.infoTitle}>Mediator DID</Text>
                      <Text style={styles.dataTextLarge}>
                        {JSON.stringify(currentUser?.mediator_did, null, 2) || 'N/A'}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </Modal>

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
        </View>
      </SafeWrapper>
    )
  }

  return (
    <SafeWrapper>
      <View style={styles.chatContainer}>
        <ChannelView
          channel={selectedChannel}
          onBack={() => setSelectedChannelId(null)}
          onViewMessage={handleViewMessage}
        />
        <MessageComposer
          currentUser={currentUser}
          selectedChannel={selectedChannel}
          sendMessage={async message => wallet.sendMessage?.(message)}
          addGuardian={async did => wallet.addGuardian?.(did)}
          removeGuardian={async did => wallet.removeGuardian?.(did)}
        />
      </View>
    </SafeWrapper>
  )
}

const styles = StyleSheet.create({
  safeWrapper: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 0, marginLeft: 8 },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  spinning: { transform: [{ rotate: '360deg' }] },
  userDid: { fontSize: 12, color: '#666' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  dataContainerScroll: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    maxHeight: 300,
  },
  dataText: { fontSize: 12, fontFamily: 'Courier New', color: '#333' },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    height: screenHeight,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerTitle: { fontSize: 18, fontWeight: '600' },
  tabsList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
  },
  tabTrigger: { flex: 1, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
  tabTriggerActive: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 14, color: '#666' },
  tabTextActive: { color: '#007AFF', fontWeight: '600' },
  tabContentScroll: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  infoSection: { marginBottom: 20 },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: { fontSize: 14, fontWeight: '600' },
  dataTextLarge: { fontSize: 12, fontFamily: 'Courier New', color: '#333', flexShrink: 1 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  modalButtonContainer: { flexDirection: 'row', gap: 12 },
  button: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  buttonTextOutline: { color: '#333', fontSize: 14, fontWeight: '600' },
})
