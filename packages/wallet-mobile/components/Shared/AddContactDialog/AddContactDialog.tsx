import { QRScanner } from '@/components/ui/WalletScreen/Components/Scanner'
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
import { AddContactDialogProps } from './AddContactDialog.intefaces'
import { styles } from './AddContactDialog.styles'

/**
 * AddContactDialog
 *
 * A modal dialog that allows the user to add a new contact by:
 * 1) Manually entering a DID
 * 2) Scanning a QR code that contains a DID
 *
 * The dialog manages its own internal UI state (input vs scanner),
 * validation, and reset behavior on close.
 */
export default function AddContactDialog({
  isDialogOpen,
  setIsDialogOpen,
  onAddContact,
}: AddContactDialogProps) {
  /**
   * Determines which UI is currently active:
   * - 'input'   → manual DID entry
   * - 'scanner' → QR scanner
   */
  const [mode, setMode] = useState<'input' | 'scanner'>('input')
  const [newChannelId, setNewChannelId] = useState('')
  const [didError, setDidError] = useState<string | null>(null)

  /**
   * Handles adding a new contact after validation.
   * - Ensures DID is not empty
   * - Calls the parent callback
   * - Resets dialog state
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
   * Callback executed when a QR code is successfully scanned.
   * - Fills the DID input
   * - Switches back to manual input mode
   * - Notifies the user
   */
  const handleQRScanned = (data: string) => {
    setNewChannelId(data)
    setMode('input')

    Alert.alert('QR Code Scanned', 'DID has been filled in. You can edit it if needed.', [
      { text: 'OK' },
    ])
  }

  /**
   * Resets dialog state and closes the modal
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
                {/* ===== Header ===== */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Contact</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* ===== Mode Tabs ===== */}
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

                {/* ===== DID Input ===== */}
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

                {/* ===== Actions ===== */}
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
              /**
               * QR Scanner Mode
               * Returns scanned DID via `onScan`
               */
              <QRScanner onScan={handleQRScanned} onCancel={() => setMode('input')} />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
