import { IconSymbol } from '@/components/others/icon-symbol'
import { Camera, CameraView } from 'expo-camera'
import * as Clipboard from 'expo-clipboard'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './Scanner.style'

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [scannedData, setScannedData] = useState<string>('')
  const [scanHistory, setScanHistory] = useState<{ data: string; timestamp: Date }[]>([])

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getCameraPermissions()
  }, [])

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true)
    setScannedData(data)

    // Add to history
    setScanHistory(prev => [{ data, timestamp: new Date() }, ...prev.slice(0, 9)])

    Alert.alert('QR Code Scanned', `Type: ${type}\nData: ${data}`, [
      { text: 'Copy', onPress: () => copyToClipboard(data) },
      { text: 'Scan Again', onPress: () => setScanned(false) },
    ])
  }

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text)
    Alert.alert('Copied!', 'QR code data copied to clipboard')
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
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>
          {scanned ? 'Tap "Scan Again" to scan another code' : 'Point camera at QR code'}
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        {!scanned ? (
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
        ) : (
          <View style={styles.resultContainer}>
            <IconSymbol name="checkmark.circle.fill" size={64} color="#4CAF50" />
            <Text style={styles.resultTitle}>Scanned Successfully!</Text>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText} numberOfLines={4}>
                {scannedData}
              </Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.copyButton]}
                onPress={() => copyToClipboard(scannedData)}
              >
                <IconSymbol name="doc.on.doc" size={20} color="#fff" />
                <Text style={styles.buttonText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.scanButton]}
                onPress={() => setScanned(false)}
              >
                <IconSymbol name="camera" size={20} color="#fff" />
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {scanHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Scans</Text>
          <ScrollView style={styles.historyList}>
            {scanHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => copyToClipboard(item.data)}
              >
                <Text style={styles.historyData} numberOfLines={1}>
                  {item.data}
                </Text>
                <Text style={styles.historyTime}>{item.timestamp.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
