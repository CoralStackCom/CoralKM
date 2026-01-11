import * as Clipboard from 'expo-clipboard'
import type React from 'react'
import { useCallback, useRef, useState } from 'react'
import { Alert, PanResponder, Pressable, Text, TouchableOpacity, View } from 'react-native'
import Canvas from 'react-native-canvas'
import { EntropyScreenProps } from './EntropyGenerator.interface'
import { styles } from './EntropyGenerator.style'
import { drawPattern, fadeOut, resetCanvas, updateSeed } from './EntropyGenerator.utils'

/**
 * Entropy screen component for generating cryptographic seeds through user interaction
 */
export const EntropyGenerator: React.FC<EntropyScreenProps> = ({ onChange, ref, size }) => {
  // Component State
  const [seed, setSeed] = useState('')
  const canvasRef = useRef<any>(null)
  const prevXRef = useRef(0)
  const prevYRef = useRef(0)
  const currXRef = useRef(0)
  const currYRef = useRef(0)
  const drawRef = useRef(false)
  const seedRef = useRef('')
  const boxSize = size || 300

  /**
   * Initialize canvas with dimensions and context
   */
  const handleCanvas = useCallback(
    (canvas: any) => {
      if (canvas) {
        canvasRef.current = canvas
        const ctx = canvas.getContext('2d')

        // Set canvas dimensions
        canvas.width = boxSize
        canvas.height = boxSize

        // Initialize with black background
        resetCanvas(ctx, boxSize, boxSize)
      }
    },
    [boxSize]
  )

  /**
   * Copy seed to clipboard
   */
  const handleCopy = async () => {
    if (seed) {
      await Clipboard.setStringAsync(seed)
      Alert.alert('Copied!', 'Seed has been copied to clipboard.')
    }
  }

  /**
   * Record touch positions for drawing calculations
   */
  const recordPositions = (x: number, y: number) => {
    prevXRef.current = currXRef.current
    prevYRef.current = currYRef.current
    currXRef.current = x
    currYRef.current = y
  }

  /**
   * Handle touch movement for drawing and entropy generation
   */
  const handleTouchMove = useCallback(
    (x: number, y: number) => {
      if (!drawRef.current || !canvasRef.current) return

      recordPositions(x, y)

      const ctx = canvasRef.current.getContext('2d')
      drawPattern(
        currXRef.current,
        currYRef.current,
        prevXRef.current,
        prevYRef.current,
        boxSize,
        boxSize,
        ctx
      )

      fadeOut(ctx, boxSize, boxSize)

      const newSeed = updateSeed(seedRef.current, currXRef.current, currYRef.current)
      seedRef.current = newSeed
      setSeed(newSeed)
      onChange?.(newSeed)
    },
    [boxSize, onChange]
  )

  /**
   * Pan responder for touch interactions
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const { locationX, locationY } = evt.nativeEvent
        recordPositions(locationX, locationY)
        drawRef.current = true
      },
      onPanResponderMove: evt => {
        const { locationX, locationY } = evt.nativeEvent
        handleTouchMove(locationX, locationY)
      },
      onPanResponderRelease: () => {
        drawRef.current = false
      },
      onPanResponderTerminate: () => {
        drawRef.current = false
      },
    })
  ).current

  /**
   * Reset canvas and clear generated seed
   */
  const resetAll = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      resetCanvas(ctx, boxSize, boxSize)
    }
    seedRef.current = ''
    setSeed('')
    onChange?.('')
  }, [boxSize, onChange])

  /**
   * Copy seed to clipboard
   */
  const copySeed = useCallback(async () => {
    if (seed) {
      await Clipboard.setStringAsync(seed)
      Alert.alert('Copied!', 'Seed copied to clipboard')
    }
  }, [seed])

  // Render
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Generate Entropy</Text>
        <Text style={styles.subheader}>
          Move your finger across the canvas to create randomness
        </Text>
      </View>

      <View style={styles.canvasContainer}>
        <View
          style={[styles.box, { width: boxSize, height: boxSize }]}
          {...panResponder.panHandlers}
        >
          <Canvas ref={handleCanvas} />
        </View>
        <Text style={styles.canvasHint}>Draw patterns to generate entropy</Text>
      </View>

      <View style={styles.seedSection}>
        <View style={styles.seedHeader}>
          <Text style={styles.seedLabel}>Generated Seed</Text>
          {seed && (
            <TouchableOpacity style={styles.copyButton} onPress={copySeed}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.seedBox}>
          <Pressable onPress={handleCopy}>
            <Text style={styles.seedText} numberOfLines={3} ellipsizeMode="middle">
              {seed || 'No seed generated yet...'}
            </Text>
          </Pressable>
        </View>
        {seed && <Text style={styles.seedSubtext}>Length: {seed.length} characters</Text>}
      </View>

      <TouchableOpacity
        style={[styles.button, !seed && styles.buttonDisabled]}
        onPress={resetAll}
        disabled={!seed}
      >
        <Text style={styles.buttonText}>Reset Canvas</Text>
      </TouchableOpacity>
    </View>
  )
}
