import type { Wallet } from '@/providers/wallet/wallet'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface RecoverModalProps {
  wallet: Wallet
}

export function RecoverModal({ wallet }: RecoverModalProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [namespaceJSON, setNamespaceJSON] = React.useState('')
  const [fieldError, setFieldError] = React.useState<string | null>(null)

  const validateField = (text: string) => {
    if (!text.trim()) {
      setFieldError(null)
      return false
    }
    try {
      const parsed = JSON.parse(text)
      if ('id' in parsed === false) {
        setFieldError('Missing required field: id')
        return false
      }
      if ('gateway_did' in parsed === false) {
        setFieldError('Missing required field: gateway_did')
        return false
      }
      setFieldError(null)
      return true
    } catch {
      setFieldError('Invalid JSON')
      return false
    }
  }

  const submitRecovery = () => {
    if (validateField(namespaceJSON)) {
      wallet.recoverWallet(JSON.parse(namespaceJSON))
      setIsDialogOpen(false)
      setNamespaceJSON('')
    }
  }

  return (
    <>
      <TouchableOpacity onPress={() => setIsDialogOpen(true)}>
        <MaterialCommunityIcons name="shield" size={24} color="#007AFF" />
      </TouchableOpacity>

      <Modal
        visible={isDialogOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsDialogOpen(false)
          setNamespaceJSON('')
          setFieldError(null)
        }}
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
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Recover Wallet</Text>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
              Paste the namespace JSON below:
            </Text>
          </View>

          <View style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 16 }}>
            <TextInput
              placeholder="Namespace"
              value={namespaceJSON}
              onChangeText={text => {
                setNamespaceJSON(text)
                validateField(text)
              }}
              multiline
              numberOfLines={8}
              style={{
                borderWidth: 1,
                borderColor: fieldError ? '#FF3B30' : '#e0e0e0',
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
                fontSize: 12,
                fontFamily: 'monospace',
              }}
            />
            {fieldError && (
              <Text style={{ fontSize: 12, color: '#FF3B30', marginBottom: 12 }}>{fieldError}</Text>
            )}
          </View>

          <View
            style={{ paddingVertical: 16, paddingHorizontal: 16, flexDirection: 'row', gap: 8 }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => {
                setIsDialogOpen(false)
                setNamespaceJSON('')
                setFieldError(null)
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: '#007AFF',
                borderRadius: 8,
                alignItems: 'center',
                opacity: !namespaceJSON.trim() || fieldError !== null ? 0.5 : 1,
              }}
              disabled={!namespaceJSON.trim() || fieldError !== null}
              onPress={submitRecovery}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Recover</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  )
}
