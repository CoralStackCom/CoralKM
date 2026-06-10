import '@/app/shim'

import { Background } from '@/components/Background'
import { SectionHeader } from '@/components/containers/Section/components/SectionHeader/SectionHeader'
import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import type { IconSymbolName } from '@/components/ui/icon-symbol'
import { useWallet } from '@/providers/wallet'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { InfoTabs } from './components/Tabs'
import { styles } from './Info.styles'

/** A section title with a tinted icon chip, matching the app's chip treatment. */
const InfoTitle: React.FC<{
  icon: IconSymbolName
  title: string
  color: string
  spaced?: boolean
}> = ({ icon, title, color, spaced }) => (
  <View style={[styles.infoTitleRow, spaced && styles.infoTitleRowSpaced]}>
    <View style={[styles.infoChip, { backgroundColor: `${color}1A` }]}>
      <IconSymbol name={icon} size={18} color={color} />
    </View>
    <Text style={styles.infoTitleText}>{title}</Text>
  </View>
)

/**
 * UserInfoScreen component.
 *
 * Displays wallet information including namespace, encryption key,
 * wallet data, and user identifiers across tabbed sections.
 */
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
          tabs={[
            { key: 'wallet', label: 'Wallet' },
            { key: 'identifiers', label: 'Identifiers' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {/* Content */}
        <ScrollView style={styles.tabContentScroll}>
          {activeTab === 'wallet' && (
            <View style={styles.infoSection}>
              <InfoTitle icon="inbox.fill" title="Wallet Namespace" color="#2B86B8" />
              <Text style={styles.dataTextLarge}>{JSON.stringify(namespace, null, 2)}</Text>

              <InfoTitle icon="key.fill" title="Wallet Data Encryption Key" color="#F2A93B" spaced />
              <Text style={styles.dataTextLarge}>{walletKey}</Text>

              <InfoTitle icon="wallet.pass" title="Wallet Data" color="#2BB3A3" spaced />
              <Text style={styles.dataTextLarge}>{JSON.stringify(backupData, null, 2)}</Text>
            </View>
          )}

          {activeTab === 'identifiers' && (
            <View style={styles.infoSection}>
              <InfoTitle icon="location.fill" title="Routing DID" color="#6C5CE7" />
              <Text style={styles.dataTextLarge}>
                {JSON.stringify(currentUser?.routing_did, null, 2) || 'N/A'}
              </Text>

              <InfoTitle icon="person.text.rectangle" title="Mediator DID" color="#2B86B8" spaced />
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
