import { Background } from '@/components/Background'
import { SectionHeader } from '@/components/contianers/Section/components/SectionHeader/SectionHeader'
import Header from '@/components/Ui/Header'
import { useWallet } from '@/providers/wallet'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { InfoTabs } from './components/Tabs'
import { styles } from './InfoScreen.styles'

export const UserInfoScreen: React.FC = () => {
  // Wallet Context
  const { user: currentUser, namespace, walletKey, backupData } = useWallet()
  // Component State
  const [activeTab, setActiveTab] = useState<'wallet' | 'identifiers'>('wallet')

  return (
    <View style={styles.screen}>
      <Background view="underwater" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Header title="User Information" showBackButton={false} />
        {/* Header */}
        <SectionHeader iconName="info.circle" title="User Info" iconSize={40} />

        {/* Tabs */}
        <InfoTabs
          Tabs={['wallet', 'identifiers']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
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
