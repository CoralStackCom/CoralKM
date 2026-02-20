import { Textarea } from '@/components/ui/TextArea'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

import { RecoverModalProps } from './RecoverModal.interfaces'
import { styles } from './RecoverModal.styles'

/**
 * RecoverModal Component
 *
 * Modal used to recover a wallet from namespace JSON.
 * Provides:
 * - Input validation
 * - Inline error display
 * - Submit / cancel actions
 *
 * @param {RecoverModalProps} props
 */

export const RecoverModal: React.FC<RecoverModalProps> = ({ wallet }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [namespaceJSON, setNamespaceJSON] = React.useState('')
  const [fieldError, setFieldError] = React.useState<string | null>(null)

  const validateField = (value: string) => {
    if (!value.trim()) {
      setFieldError(null)
      return false
    }

    try {
      const parsed = JSON.parse(value)

      if (!('id' in parsed)) {
        setFieldError('Missing required field: id')
        return false
      }
      if (!('gateway_did' in parsed)) {
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
    if (!validateField(namespaceJSON)) return
    wallet.recoverWallet(JSON.parse(namespaceJSON))
    setIsDialogOpen(false)
    setNamespaceJSON('')
  }

  const resetState = () => {
    setIsDialogOpen(false)
    setNamespaceJSON('')
    setFieldError(null)
  }

  return (
    <>
      <TouchableOpacity onPress={() => setIsDialogOpen(true)}>
        <MaterialCommunityIcons name="shield" size={24} color="#007AFF" />
      </TouchableOpacity>

      <Modal transparent visible={isDialogOpen} animationType="slide" onRequestClose={resetState}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Recover Wallet</Text>
            <Text style={styles.headerText}>Paste the namespace JSON below:</Text>
          </View>

          <View style={styles.body}>
            <Textarea
              placeholder="Namespace JSON"
              numberOfLines={8}
              value={namespaceJSON}
              onChangeText={(txt: string) => {
                setNamespaceJSON(txt)
                validateField(txt)
              }}
              style={[styles.textInput, { borderColor: fieldError ? '#FF3B30' : '#e0e0e0' }]}
            />

            {fieldError && <Text style={styles.errorText}>{fieldError}</Text>}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={resetState}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recoverBtn,
                { opacity: !namespaceJSON.trim() || fieldError ? 0.5 : 1 },
              ]}
              disabled={!namespaceJSON.trim() || fieldError !== null}
              onPress={submitRecovery}
            >
              <Text style={styles.recoverText}>Recover</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  )
}
export default RecoverModal
