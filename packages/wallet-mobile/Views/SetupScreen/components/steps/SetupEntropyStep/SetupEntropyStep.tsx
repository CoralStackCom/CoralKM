import {
  drawPattern,
  fadeOut,
  resetCanvas,
  updateSeed,
} from '@/components/EntropyGenerator/EntropyGenerator.utils'
import { StepPanel } from '@/components/Stepper/components'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { palette } from '@/constants/design'
import * as Clipboard from 'expo-clipboard'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Alert, PanResponder, Pressable, Text, TouchableOpacity, View } from 'react-native'
import Canvas from 'react-native-canvas'
import { styles } from './SetupEntropyStep.styles'
import { SetupEntropyStepProps } from './SetupEntropyStep.interfaces'

/** Number of drawn samples considered "strong" entropy. */
const STRENGTH_TARGET = 80

/**
 * Setup Entropy Step
 *
 * A step in the setup wizard that lets users generate an encryption seed by
 * drawing on a canvas. A live strength meter shows how much randomness has been
 * gathered to guide the user toward a strong seed.
 */
export const SetupEntropyStep: React.FC<SetupEntropyStepProps> = ({ onNext, nextStep }) => {
  // Component State
  const [seed, setSeed] = useState('')
  const [points, setPoints] = useState(0)
  const canvasRef = useRef<any>(null)
  const prevXRef = useRef(0)
  const prevYRef = useRef(0)
  const currXRef = useRef(0)
  const currYRef = useRef(0)
  const drawRef = useRef(false)
  const seedRef = useRef('')
  const boxSize = 280

  /** Initialize canvas with dimensions and context */
  const handleCanvas = useCallback(
    (canvas: any) => {
      if (canvas) {
        canvasRef.current = canvas
        const ctx = canvas.getContext('2d')
        canvas.width = boxSize
        canvas.height = boxSize
        resetCanvas(ctx, boxSize, boxSize)
      }
    },
    [boxSize]
  )

  /** Record touch positions for drawing calculations */
  const recordPositions = (x: number, y: number) => {
    prevXRef.current = currXRef.current
    prevYRef.current = currYRef.current
    currXRef.current = x
    currYRef.current = y
  }

  /** Handle touch movement for drawing and entropy generation */
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
      setPoints((p) => p + 1)
    },
    [boxSize]
  )

  /** Pan responder for touch interactions */
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

  /** Reset canvas and clear generated seed */
  const resetAll = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      resetCanvas(ctx, boxSize, boxSize)
    }
    seedRef.current = ''
    setSeed('')
    setPoints(0)
  }, [boxSize])

  /** Copy seed to clipboard */
  const copySeed = useCallback(async () => {
    if (seed) {
      await Clipboard.setStringAsync(seed)
      Alert.alert('Copied!', 'Seed copied to clipboard')
    }
  }, [seed])

  /** Handle next step */
  const handleNext = () => {
    if (seed) onNext(seed)
  }

  /** Entropy strength 0..1 and its label/color. */
  const strength = useMemo(() => Math.min(points / STRENGTH_TARGET, 1), [points])
  const strengthMeta = useMemo(() => {
    if (strength <= 0) return { label: 'Start drawing', color: palette.textMuted }
    if (strength < 0.4) return { label: 'Keep going…', color: palette.amber }
    if (strength < 0.8) return { label: 'Good entropy', color: palette.blue }
    return { label: 'Strong 🔒', color: palette.teal }
  }, [strength])

  // Render
  return (
    <StepPanel title="Generate Encryption Seed" nextStep={nextStep} isReady={!!seed} onNext={handleNext}>
      <View style={styles.content}>
        <Text style={styles.description}>
          Move your finger across the canvas to create randomness for your encryption key.
        </Text>

        <View style={styles.canvasContainer}>
          <View
            style={[styles.canvasBox, { width: boxSize, height: boxSize }]}
            {...panResponder.panHandlers}
          >
            <Canvas ref={handleCanvas} />
            {!seed && (
              <View style={styles.canvasOverlay} pointerEvents="none">
                <IconSymbol name="pencil" size={28} color={palette.accentLight} />
                <Text style={styles.canvasOverlayText}>Draw here</Text>
              </View>
            )}
          </View>
        </View>

        {/* Strength meter */}
        <View style={styles.strengthSection}>
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthLabel}>Entropy strength</Text>
            <Text style={[styles.strengthValue, { color: strengthMeta.color }]}>
              {strengthMeta.label}
            </Text>
          </View>
          <View style={styles.strengthTrack}>
            <View
              style={[
                styles.strengthFill,
                { width: `${Math.round(strength * 100)}%`, backgroundColor: strengthMeta.color },
              ]}
            />
          </View>
        </View>

        {/* Generated seed */}
        <View style={styles.seedSection}>
          <View style={styles.seedHeader}>
            <Text style={styles.seedLabel}>Generated Seed</Text>
            {!!seed && (
              <TouchableOpacity style={styles.copyButton} onPress={copySeed}>
                <IconSymbol name="download.alt.fill" size={13} color={palette.navy} />
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.seedBox}>
            <Pressable onPress={copySeed}>
              <Text style={styles.seedText} numberOfLines={2} ellipsizeMode="middle">
                {seed || 'No seed generated yet…'}
              </Text>
            </Pressable>
          </View>
          {!!seed && <Text style={styles.seedSubtext}>{seed.length} characters · SHA-256</Text>}
        </View>

        <TouchableOpacity
          style={[styles.resetButton, !seed && styles.resetButtonDisabled]}
          onPress={resetAll}
          disabled={!seed}
        >
          <IconSymbol name="trash.fill" size={15} color={seed ? palette.coral : palette.textMuted} />
          <Text style={[styles.resetButtonText, { color: seed ? palette.coral : palette.textMuted }]}>
            Reset Canvas
          </Text>
        </TouchableOpacity>
      </View>
    </StepPanel>
  )
}
export default SetupEntropyStep
