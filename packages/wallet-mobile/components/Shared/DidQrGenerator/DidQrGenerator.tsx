import { Share2, X } from 'lucide-react-native'
import { Alert, Modal, Pressable, Share, Text, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { ShareDIDModalProps } from './DidQrGenerator.interfaces'
import { styles } from './DidQrGenerator.styles'

export function DidQrGenerator({ visible, onClose, did, userName }: ShareDIDModalProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `My DID: ${did}`,
        title: 'Share DID',
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to share DID')
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share Your DID</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </Pressable>
          </View>

          {/* User Name */}
          {userName && <Text style={styles.userName}>{userName}</Text>}

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode value={did} size={250} backgroundColor="white" color="black" />
            </View>
          </View>

          {/* DID Text */}
          <View style={styles.didContainer}>
            <Text style={styles.didLabel}>Your DID</Text>
            <Text style={styles.didText} numberOfLines={2} ellipsizeMode="middle">
              {did}
            </Text>
          </View>

          {/* Share Button */}
          <Pressable style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color="white" />
            <Text style={styles.shareButtonText}>Share DID</Text>
          </Pressable>

          {/* Instruction Text */}
          <Text style={styles.instructionText}>
            Others can scan this QR code to add you as a contact
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
