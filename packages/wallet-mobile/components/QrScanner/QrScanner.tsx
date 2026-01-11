import { IconSymbol } from '@/components/Ui/icon-symbol'
import { Camera, CameraView } from 'expo-camera'
import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { QRScannerComponentProps } from './QeScanner.interfaces'
import { styles } from './QrScanner.styles'

/**
 * QRScanner component.
 *
 * Provides a camera interface to scan QR codes for DID.
 *
 * Features:
 * - Requests camera permission
 * - Displays scanning UI with overlay
 * - Handles successful QR code scans
 * - Optional cancel button
 */
export const QRScanner: React.FC<QRScannerComponentProps> = ({ onScan, onCancel }) => {
  /**
   * component States
   */
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)

  /**
   * Request camera permission on mount
   */
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getCameraPermissions()
  }, [])

  /**
   * Handle scanned barcode data
   */
  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true)
      onScan(data)
    }
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <IconSymbol name="camera" size={64} color="#999" />
        <Text style={styles.message}>No access to camera</Text>
        <Text style={styles.subMessage}>Please enable camera permissions in settings</Text>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan QR Code</Text>
        <Text style={styles.subtitle}>Point camera at the DID QR code</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
          </View>
        </CameraView>
      </View>

      {onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
export default QRScanner
