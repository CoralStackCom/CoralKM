import { IconSymbol } from '@/components/ui/icon-symbol'
import { Camera, CameraView } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { QRScannerComponentProps } from './QrScanner.interfaces'
import { SCAN_FRAME_DIMENSIONS, styles } from './QrScanner.styles'

/**
 * AnimatedCorner component.
 *
 * Renders a single L-shaped corner bracket with a pulsing opacity animation
 * to draw attention to the scan area.
 */
const AnimatedCorner: React.FC<{
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  animatedOpacity: Animated.Value
}> = ({ position, animatedOpacity }) => {
  const positionStyle = {
    topLeft: styles.cornerTopLeft,
    topRight: styles.cornerTopRight,
    bottomLeft: styles.cornerBottomLeft,
    bottomRight: styles.cornerBottomRight,
  }[position]

  return (
    <Animated.View
      style={[styles.cornerBase, positionStyle, { opacity: animatedOpacity }]}
    />
  )
}

/**
 * QRScanner component.
 *
 * Provides a full-featured camera interface to scan QR codes for DID resolution.
 *
 * Features:
 * - Requests camera permission on mount
 * - Animated corner brackets that pulse around the scan area
 * - Torch/flashlight toggle for low-light scanning
 * - Import QR code image from device gallery
 * - Haptic feedback on successful scan
 * - Validation with configurable pattern and error messaging
 * - Optional cancel button
 */
export const QRScanner: React.FC<QRScannerComponentProps> = ({
  onScan,
  onCancel,
  validPattern,
  invalidMessage = 'Invalid QR code format',
}) => {
  /**
   * Component state
   */
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [torch, setTorch] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Animation refs
   */
  const cornerOpacity = useRef(new Animated.Value(1)).current
  const scanLinePosition = useRef(new Animated.Value(0)).current

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
   * Start corner pulse animation loop
   */
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerOpacity, {
          toValue: 0.3,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cornerOpacity, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )

    pulseAnimation.start()

    return () => {
      pulseAnimation.stop()
    }
  }, [cornerOpacity])

  /**
   * Start scan line sweep animation loop
   */
  useEffect(() => {
    const { size, cornerThickness } = SCAN_FRAME_DIMENSIONS
    const travelDistance = size - cornerThickness * 2 - 8

    const sweepAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLinePosition, {
          toValue: travelDistance,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLinePosition, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )

    sweepAnimation.start()

    return () => {
      sweepAnimation.stop()
    }
  }, [scanLinePosition])

  /**
   * Validate scanned data against the provided pattern.
   * Returns true if data is valid or no pattern is specified.
   */
  const validateData = useCallback(
    (data: string): boolean => {
      if (!validPattern) return true
      return validPattern.test(data)
    },
    [validPattern]
  )

  /**
   * Handle scanned barcode data with validation and haptic feedback
   */
  const handleBarCodeScanned = useCallback(
    async ({ data }: { type: string; data: string }) => {
      if (scanned) return

      if (!validateData(data)) {
        setError(invalidMessage)
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

        // Allow re-scanning after showing error briefly
        setTimeout(() => {
          setError(null)
        }, 3000)
        return
      }

      setScanned(true)
      setError(null)

      // Trigger success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      onScan(data)
    },
    [scanned, validateData, invalidMessage, onScan]
  )

  /**
   * Toggle torch/flashlight state
   */
  const handleToggleTorch = useCallback(async () => {
    setTorch((prev) => !prev)
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [])

  /**
   * Open device gallery to pick a QR code image.
   * Returns the selected image URI via onScan callback.
   */
  const handleGalleryImport = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    })

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      onScan(imageUri)
    }
  }, [onScan])

  /**
   * Permission: loading state
   */
  if (hasPermission === null) {
    return (
      <View style={styles.stateContainer}>
        <IconSymbol name="camera" size={56} color="#7EADC9" />
        <Text style={styles.message}>Requesting camera permission…</Text>
      </View>
    )
  }

  /**
   * Permission: denied state
   */
  if (hasPermission === false) {
    return (
      <View style={styles.stateContainer}>
        <IconSymbol name="camera" size={64} color="#7EADC9" />
        <Text style={styles.message}>No access to camera</Text>
        <Text style={styles.subMessage}>Please enable camera permissions in settings</Text>
        {onCancel && (
          <TouchableOpacity
            style={[styles.cancelButton, { minHeight: 44 }]}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Return to the previous screen"
          >
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Live camera fills the screen */}
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417'] }}
      />

      {/* Dimming mask with a clear cutout window */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.maskTop} />
        <View style={styles.maskRow}>
          <View style={styles.maskSide} />
          <View style={styles.scanFrameWrapper}>
            <AnimatedCorner position="topLeft" animatedOpacity={cornerOpacity} />
            <AnimatedCorner position="topRight" animatedOpacity={cornerOpacity} />
            <AnimatedCorner position="bottomLeft" animatedOpacity={cornerOpacity} />
            <AnimatedCorner position="bottomRight" animatedOpacity={cornerOpacity} />
            <Animated.View
              style={[
                styles.scanLine,
                {
                  top: SCAN_FRAME_DIMENSIONS.cornerThickness + 6,
                  transform: [{ translateY: scanLinePosition }],
                  opacity: cornerOpacity,
                },
              ]}
            />
          </View>
          <View style={styles.maskSide} />
        </View>

        {/* Bottom scrim: instruction, error, and controls */}
        <View style={styles.maskBottom}>
          <View style={styles.instructionPill}>
            <IconSymbol name="search" size={16} color="#fff" />
            <Text style={styles.instructionText}>Align the QR code within the frame</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle" size={18} color="#fff" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.actionsRow}>
            <View style={styles.control}>
              <TouchableOpacity
                style={[styles.controlButton, torch && styles.controlButtonActive]}
                onPress={handleToggleTorch}
                accessibilityLabel={torch ? 'Turn off flashlight' : 'Turn on flashlight'}
                accessibilityRole="button"
                accessibilityState={{ selected: torch }}
              >
                <IconSymbol
                  name={torch ? 'flashlight.on.fill' : 'flashlight.off.fill'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>{torch ? 'Light on' : 'Light'}</Text>
            </View>

            <View style={styles.control}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleGalleryImport}
                accessibilityLabel="Import QR code from gallery"
                accessibilityRole="button"
              >
                <IconSymbol name="photo.on.rectangle" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>Gallery</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Header with title + close */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle} accessibilityRole="header">
          Scan QR Code
        </Text>
        {onCancel ? (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Close scanner"
          >
            <IconSymbol name="xmark" size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>
    </View>
  )
}

export default QRScanner
