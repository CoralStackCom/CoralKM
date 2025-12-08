import type { WalletExportedData } from '@/providers/wallet/wallet'
import type { INamespace } from '@coralkm/core'
import React from 'react'
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface RecoverModalProps {
  recoveredWallet?: {
    key: string
    data: WalletExportedData
    namespace: INamespace
  }
}

export function RecoverSuccessModal({ recoveredWallet }: RecoverModalProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (recoveredWallet) {
      setIsDialogOpen(true)
    }
  }, [recoveredWallet])

  return (
    <Modal
      visible={isDialogOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsDialogOpen(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Wallet Recovered Successfully!</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
            The wallet has been successfully recovered.
          </Text>
        </View>

        <ScrollView style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Namespace:</Text>
          <Text
            style={{
              fontSize: 10,
              backgroundColor: '#f5f5f5',
              padding: 12,
              borderRadius: 8,
              fontFamily: 'monospace',
              marginBottom: 16,
            }}
          >
            {JSON.stringify(recoveredWallet?.namespace, null, 2)}
          </Text>

          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
            Data Encryption Key:
          </Text>
          <Text
            style={{
              fontSize: 10,
              backgroundColor: '#f5f5f5',
              padding: 12,
              borderRadius: 8,
              fontFamily: 'monospace',
              marginBottom: 16,
            }}
          >
            {recoveredWallet?.key}
          </Text>

          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
            Decrypted Wallet Backup:
          </Text>
          <Text
            style={{
              fontSize: 10,
              backgroundColor: '#f5f5f5',
              padding: 12,
              borderRadius: 8,
              fontFamily: 'monospace',
            }}
          >
            {JSON.stringify(recoveredWallet?.data, null, 2)}
          </Text>
        </ScrollView>

        <View style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              backgroundColor: '#007AFF',
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => setIsDialogOpen(false)}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>OK</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
