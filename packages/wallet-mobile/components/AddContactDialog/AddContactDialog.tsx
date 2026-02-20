import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import QRScanner from '../QrScanner'
import { AddContactDialogProps } from './AddContactDialog.interfaces'
import { styles } from './AddContactDialog.styles'

/**
 * AddContactDialog component.
 *
 * Provides a modal interface to add a new contact either by:
 * - Manually entering a DID
 * - Scanning a DID from a QR code
 */
export const AddContactDialog: React.FC<AddContactDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  onAddContact,
}) => {
  /**
   * Component State
   */
  const [mode, setMode] = useState<'input' | 'scanner'>('input')
  const [newChannelId, setNewChannelId] = useState('')
  const [didError, setDidError] = useState<string | null>(null)

  /**
   * Handle adding a new contact
   */
  const handleAddChannel = () => {
    if (!newChannelId.trim()) {
      setDidError('Please enter a valid DID')
      return
    }

    onAddContact(newChannelId.trim())

    setNewChannelId('')
    setDidError(null)
    setMode('input')
    setIsDialogOpen(false)
  }

  /**
   * Handle successful QR scan
   */
  const handleQRScanned = (data: string) => {
    setNewChannelId(data)
    setMode('input')

    Alert.alert('QR Code Scanned', 'DID has been filled in. You can edit it if needed.', [
      { text: 'OK' },
    ])
  }

  /**
   * Close dialog and reset state
   */
  const handleClose = () => {
    setIsDialogOpen(false)
    setMode('input')
    setNewChannelId('')
    setDidError(null)
  }

  return (
    <Modal visible={isDialogOpen} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {mode === 'input' ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Contact</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tab, styles.tabActive]}
                    onPress={() => setMode('input')}
                  >
                    <Text style={styles.tabTextActive}>Manual Input</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.tab} onPress={() => setMode('scanner')}>
                    <Text style={styles.tabText}>Scan QR Code</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={[styles.input, didError && { borderColor: '#FF3B30' }]}
                  placeholder="Contact DID"
                  value={newChannelId}
                  onChangeText={text => {
                    setNewChannelId(text)
                    setDidError(null)
                  }}
                  placeholderTextColor="#999"
                />

                {didError && <Text style={styles.errorText}>{didError}</Text>}

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonOutline]}
                    onPress={handleClose}
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
              </>
            ) : (
              <QRScanner onScan={handleQRScanned} onCancel={() => setMode('input')} />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default AddContactDialog
