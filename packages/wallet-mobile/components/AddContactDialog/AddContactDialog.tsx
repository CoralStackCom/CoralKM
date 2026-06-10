import { IconSymbol } from '@/components/ui/icon-symbol'
import { palette } from '@/constants/design'
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

/** Loose DID shape used to validate scanned/entered values. */
const DID_PATTERN = /^did:[a-z0-9]+:.+/i

/**
 * AddContactDialog component.
 *
 * A bottom-sheet to add a new contact either by entering a DID or by scanning a
 * DID QR code. Scanning opens the full-screen QR scanner.
 */
export const AddContactDialog: React.FC<AddContactDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  onAddContact,
}) => {
  const [mode, setMode] = useState<'input' | 'scanner'>('input')
  const [newChannelId, setNewChannelId] = useState('')
  const [didError, setDidError] = useState<string | null>(null)

  /** Handle adding a new contact */
  const handleAddChannel = () => {
    const did = newChannelId.trim()
    if (!did) {
      setDidError('Please enter a DID')
      return
    }
    if (!DID_PATTERN.test(did)) {
      setDidError('Enter a valid DID (e.g. did:peer:...)')
      return
    }

    onAddContact(did)

    setNewChannelId('')
    setDidError(null)
    setMode('input')
    setIsDialogOpen(false)
  }

  /** Handle successful QR scan */
  const handleQRScanned = (data: string) => {
    setNewChannelId(data)
    setMode('input')

    Alert.alert('QR Code Scanned', 'DID has been filled in. You can edit it if needed.', [
      { text: 'OK' },
    ])
  }

  /** Close dialog and reset state */
  const handleClose = () => {
    setIsDialogOpen(false)
    setMode('input')
    setNewChannelId('')
    setDidError(null)
  }

  return (
    <Modal visible={isDialogOpen} transparent animationType="slide" onRequestClose={handleClose}>
      {mode === 'scanner' ? (
        <QRScanner
          onScan={handleQRScanned}
          onCancel={() => setMode('input')}
          validPattern={DID_PATTERN}
          invalidMessage="That QR code isn't a valid DID"
        />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.handle} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Contact</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, styles.tabActive]} onPress={() => setMode('input')}>
                  <IconSymbol name="pencil" size={16} color={palette.navy} />
                  <Text style={styles.tabTextActive}>Manual Input</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => setMode('scanner')}>
                  <IconSymbol name="qrcode" size={16} color={palette.textMuted} />
                  <Text style={styles.tabText}>Scan QR Code</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Contact DID</Text>
              <TextInput
                style={[styles.input, didError && { borderColor: palette.coral }]}
                placeholder="did:peer:..."
                value={newChannelId}
                onChangeText={text => {
                  setNewChannelId(text)
                  setDidError(null)
                }}
                placeholderTextColor={palette.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {didError && <Text style={styles.errorText}>{didError}</Text>}

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={handleClose}>
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
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </Modal>
  )
}

export default AddContactDialog
