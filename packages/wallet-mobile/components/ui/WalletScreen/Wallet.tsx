import { styleMessage } from '@/lib/style-messages'
import { useWallet } from '@/providers/wallet'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useCallback, useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ChannelList } from './Components/ChannelList'
import ChannelView from './Components/ChannelView'
import { MessageComposer } from './Components/MessageComposer/MessageComposer'
import { UserProfileSelector } from './Components/UserProfileSelector/UserProfileSelector'
import { IChannelMessage } from './wallet.interfaces'
import { styles } from './wallet.style'

export default function Wallet() {
  const { user: currentUser, wallet, namespace, walletKey, backupData, channels } = useWallet()
  const [didAddress, setDidAddress] = useState<string>('null')
  const [selectedChannelId, setSelectedChannelId] = useState<any>(null)
  const [isMessageDetailsOpen, setIsMessageDetailsOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<IChannelMessage | null>(null)
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false)
  const [copied, setCopied] = useState<'did' | 'namespace' | null>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [activeTab, setActiveTab] = useState<'wallet' | 'identifiers'>('wallet')

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
                    // if (currentUser?.routing_id) {
                    //   setDidAddress(currentUser.routing_id)
                    // } else if (currentUser?.mediator_id) {
                    //   setDidAddress(currentUser.mediator_id)
                    // } else {
                    //   setDidAddress('null')
                    // }
                  }}
                />
              ) : null}
              <Text style={styles.userDid} numberOfLines={1}>
                ({didAddress})
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
                onPress={() => handleCopy(didAddress, 'did')}
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
              ({didAddress || 'No DID'})
            </Text>
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
