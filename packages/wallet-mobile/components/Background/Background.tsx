import { LinearGradient } from 'expo-linear-gradient'
import { memo, useEffect, useState } from 'react'
import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import type { BackgroundProps, PhaseType, ViewType } from './Background.interface'
import { styles } from './Background.style'
import { getCurrentPhase, getPhaseGradients } from './Background.utils'
import { Aquarium } from './effects/aquarium'
import { WaterGlimmer } from './effects/WaterGlimmer'
import { WaterLightRays } from './effects/WaterLightRays'

const MemoizedWaterGlimmer = memo(WaterGlimmer)
MemoizedWaterGlimmer.displayName = 'MemoizedWaterGlimmer'

const MemoizedWaterLightRays = memo(WaterLightRays)
MemoizedWaterLightRays.displayName = 'MemoizedWaterLightRays'

const MemoizedAquarium = memo(Aquarium)
MemoizedAquarium.displayName = 'MemoizedAquarium'

/**
 * Background component with animated scenes and time-based phases
 * React Native version using Reanimated + SVG for effects
 * OPTIMIZED for mobile performance
 */
function Background({
  disableAnimations = false,
  view = 'land',
  phase,
  updateFrequency = 15,
  onTransitionEnd,
}: BackgroundProps) {
  const [currentPhase, setCurrentPhase] = useState<PhaseType>(phase || getCurrentPhase())
  const [activeView, setActiveView] = useState<ViewType>(view)
  const gradients = getPhaseGradients(currentPhase)

  // Animated values for view transitions
  const skyOpacity = useSharedValue(view === 'sky' ? 1 : 0)
  const landOpacity = useSharedValue(view === 'land' ? 1 : 0)
  const underwaterOpacity = useSharedValue(view === 'underwater' ? 1 : 0)

  // Update phase automatically if not provided
  useEffect(() => {
    if (phase) {
      setCurrentPhase(phase)
      return
    }

    setCurrentPhase(getCurrentPhase())
    const timer = setInterval(
      () => {
        setCurrentPhase(getCurrentPhase())
      },
      1000 * 60 * updateFrequency
    )
    return () => clearInterval(timer)
  }, [phase, updateFrequency])

  // Handle view transitions
  useEffect(() => {
    const duration = 2000
    skyOpacity.value = withTiming(view === 'sky' ? 1 : 0, { duration })
    landOpacity.value = withTiming(view === 'land' ? 1 : 0, { duration })
    underwaterOpacity.value = withTiming(view === 'underwater' ? 1 : 0, { duration })

    const viewTimer = setTimeout(() => {
      setActiveView(view)
    }, duration / 2)

    // Trigger onTransitionEnd after animation
    if (onTransitionEnd) {
      const endTimer = setTimeout(() => onTransitionEnd(view), duration)
      return () => {
        clearTimeout(viewTimer)
        clearTimeout(endTimer)
      }
    }

    return () => clearTimeout(viewTimer)
  }, [view, skyOpacity, landOpacity, underwaterOpacity, onTransitionEnd])

  useEffect(() => {
    return () => {
      cancelAnimation(skyOpacity)
      cancelAnimation(landOpacity)
      cancelAnimation(underwaterOpacity)
    }
  }, [skyOpacity, landOpacity, underwaterOpacity])

  const skyAnimatedStyle = useAnimatedStyle(() => ({
    opacity: skyOpacity.value,
  }))

  const landAnimatedStyle = useAnimatedStyle(() => ({
    opacity: landOpacity.value,
  }))

  const underwaterAnimatedStyle = useAnimatedStyle(() => ({
    opacity: underwaterOpacity.value,
  }))

  const showLandEffects = !disableAnimations && activeView === 'land'
  const showUnderwaterEffects = !disableAnimations && activeView === 'underwater'

  return (
    <View style={styles.container}>
      {/* === SKY VIEW === */}
      <Animated.View
        style={[StyleSheet.absoluteFill, skyAnimatedStyle]}
        pointerEvents={view === 'sky' ? 'auto' : 'none'}
      >
        <LinearGradient
          colors={gradients.sky as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        >
          {(currentPhase === 'night' ||
            currentPhase === 'morning' ||
            currentPhase === 'evening') && (
            <Image
              source={require('@/assets/svg/stars.png')}
              style={[styles.stars, { opacity: currentPhase === 'night' ? 1 : 0.3 }]}
              resizeMode="cover"
            />
          )}
          <Image
            source={
              (currentPhase === 'morning'
                ? require('@/assets/svg/sun--morning.png')
                : require('@/assets/svg/sun--day.png')) as ImageSourcePropType
            }
            style={styles.sun}
            resizeMode="contain"
          />
        </LinearGradient>
      </Animated.View>

      {/* === LAND VIEW === */}
      <Animated.View
        style={[StyleSheet.absoluteFill, landAnimatedStyle]}
        pointerEvents={view === 'land' ? 'auto' : 'none'}
      >
        <LinearGradient
          colors={gradients.land as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {showLandEffects && (
          <View style={styles.waterArea}>
            <MemoizedWaterGlimmer totalGlimmers={8} />
          </View>
        )}
        <Image
          source={require('@/assets/svg/mountains-left.png')}
          style={styles.mountainsLeft}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/svg/mountains-right.png')}
          style={styles.mountainsRight}
          resizeMode="contain"
        />
      </Animated.View>

      {/* === UNDERWATER VIEW === */}
      <Animated.View
        style={[StyleSheet.absoluteFill, underwaterAnimatedStyle]}
        pointerEvents={view === 'underwater' ? 'auto' : 'none'}
      >
        <LinearGradient
          colors={gradients.underwater as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {showUnderwaterEffects && (
          <>
            <MemoizedWaterLightRays totalRays={3} alphaTop={0.25} alphaBottom={0} />
            <MemoizedAquarium fishGroupCount={3} fishGroupMax={5} />
          </>
        )}
      </Animated.View>
    </View>
  )
}

export default memo(Background)
