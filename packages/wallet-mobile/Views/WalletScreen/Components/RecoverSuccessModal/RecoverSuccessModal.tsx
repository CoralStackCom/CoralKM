import React from 'react'
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { RecoverSuccessModalProps } from './RecoverSuccessModal.interfaces'
import { styles } from './RecoverSuccessModal.styles'

/**
 * RecoverSuccessModal Component
 *
 * Displays a modal showing the recovered wallet information:
 * - Namespace JSON
 * - Data encryption key
 * - Decrypted wallet backup
 *
 * Opens automatically if `recoveredWallet` is provided.
 *
 * @param {RecoverSuccessModalProps} props
 */

export const RecoverSuccessModal: React.FC<RecoverSuccessModalProps> = ({ recoveredWallet }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (recoveredWallet) setIsDialogOpen(true)
  }, [recoveredWallet])

  return (
    <Modal
      visible={isDialogOpen}
      animationType="slide"
      transparent
      onRequestClose={() => setIsDialogOpen(false)}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet Recovered Successfully!</Text>
          <Text style={styles.headerText}>The wallet has been successfully recovered.</Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.body}>
          <Text style={styles.label}>Namespace:</Text>
          <Text style={styles.codeBlock}>
            {JSON.stringify(recoveredWallet?.namespace, null, 2)}
          </Text>

          <Text style={styles.label}>Data Encryption Key:</Text>
          <Text style={styles.codeBlock}>{recoveredWallet?.key}</Text>

          <Text style={styles.label}>Decrypted Wallet Backup:</Text>
          <Text style={styles.codeBlock}>{JSON.stringify(recoveredWallet?.data, null, 2)}</Text>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.okButton} onPress={() => setIsDialogOpen(false)}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
export default RecoverSuccessModal
