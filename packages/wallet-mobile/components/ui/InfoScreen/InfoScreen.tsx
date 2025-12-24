import { IconSymbol } from '@/components/others/icon-symbol'
import { useWallet } from '@/providers/wallet'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from './InfoScreen.styles'

export default function UserInfoScreen() {
  const { user: currentUser, namespace, walletKey, backupData } = useWallet()

  const [activeTab, setActiveTab] = useState<'wallet' | 'identifiers'>('wallet')

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol name="info.circle" size={40} color="#1B5678" />
          <Text style={styles.title}>User Info</Text>
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
            style={[styles.tabTrigger, activeTab === 'identifiers' && styles.tabTriggerActive]}
            onPress={() => setActiveTab('identifiers')}
          >
            <Text style={[styles.tabText, activeTab === 'identifiers' && styles.tabTextActive]}>
              Identifiers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.tabContentScroll}>
          {activeTab === 'wallet' && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Wallet Namespace</Text>
              <Text style={styles.dataTextLarge}>{JSON.stringify(namespace, null, 2)}</Text>

              <Text style={[styles.infoTitle, { marginTop: 16 }]}>Wallet Data Encryption Key</Text>
              <Text style={styles.dataTextLarge}>{walletKey}</Text>

              <Text style={[styles.infoTitle, { marginTop: 16 }]}>Wallet Data</Text>
              <Text style={styles.dataTextLarge}>{JSON.stringify(backupData, null, 2)}</Text>
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
  )
}
