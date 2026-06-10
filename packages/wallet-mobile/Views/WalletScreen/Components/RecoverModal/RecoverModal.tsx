import { Textarea } from '@/components/ui/TextArea'
import { useFormValidation, validators } from '@/hooks'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

import { RecoverModalProps } from './RecoverModal.interfaces'
import { styles } from './RecoverModal.styles'

const schema = {
  namespaceJSON: [
    validators.required('Namespace JSON is required'),
    validators.jsonWithKeys(['id', 'gateway_did']),
  ],
}

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
  const { errors, validateField, clearErrors } = useFormValidation(schema)

  const submitRecovery = () => {
    if (!validateField('namespaceJSON', namespaceJSON)) return
    wallet.recoverWallet(JSON.parse(namespaceJSON))
    setIsDialogOpen(false)
    setNamespaceJSON('')
  }

  const resetState = () => {
    setIsDialogOpen(false)
    setNamespaceJSON('')
    clearErrors()
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
                validateField('namespaceJSON', txt)
              }}
              style={styles.textInput}
              error={errors.namespaceJSON}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={resetState}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recoverBtn,
                { opacity: !namespaceJSON.trim() || errors.namespaceJSON ? 0.5 : 1 },
              ]}
              disabled={!namespaceJSON.trim() || errors.namespaceJSON !== null}
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
