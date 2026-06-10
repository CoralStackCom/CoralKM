import LottieView from 'lottie-react-native'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimationState, LoginAnimationProps, LoginAnimationRef } from './LoginAnimation.interfaces'
import { styles } from './LoginAnimation.styles'

// Import Lottie JSON files - adjust paths to match your project structure
const splashData = require('@/assets/animations/login-transition-splash.json')
const animationData = require('@/assets/animations/login-transition.json')

/* Get screen height for calculations */
const { height: SCREEN_HEIGHT } = Dimensions.get('window')

/**
 * LoginAnimation Component
 * Controls the fish login animation with loading, jump, and splash effects.
 * Exposes methods via ref to control the animation.
 * Props:
 * @param onFishJump: Callback when fish starts jumping down (hide the form)
 * @param onSplash: Callback when fish hits the water (transition to underwater view)
 * @param onEnd: Callback when animation has ended
 * @param waterSurfaceY: Y position of the water surface (where splash should happen)
 * @param logoY: Y position of the logo (where fish starts)
 * @param sizes: Sizes of the fish animation
 */
const LoginAnimation = forwardRef<LoginAnimationRef, LoginAnimationProps>(
  ({ onFishJump, onSplash, onEnd, waterSurfaceY, logoY, sizes }, ref) => {
    const [state, setState] = useState<AnimationState>('logo')
    const [showSplash, setShowSplash] = useState(false)

    const fishRef = useRef<LottieView>(null)
    const splashRef = useRef<LottieView>(null)
    const stateRef = useRef<AnimationState>('logo')
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

    // Animation values - start visible at logo position
    const translateY = useSharedValue(0)
    const opacity = useSharedValue(1)

    // Calculate fish travel distance
    const fishTravel = waterSurfaceY - logoY
    // Cleanup timers on unmount
    useEffect(() => {
      return () => {
        timersRef.current.forEach(clearTimeout)
      }
    }, [])

    /**
     * Start loading animation - fish swims back and forth
     */
    const loading = useCallback(() => {
      if (stateRef.current !== 'logo') return

      setState('loading')
      stateRef.current = 'loading'

      // Play frames 26-75 in loop
      fishRef.current?.play(25, 75)
    }, [])

    /**
     * Stop loading and return to logo pose
     */
    const stop = useCallback(() => {
      if (stateRef.current !== 'loading') return

      setState('logo')
      stateRef.current = 'logo'

      // Reset to frame 25 (logo pose)
      fishRef.current?.reset()
    }, [])

    /**
     * Jump animation - fish jumps up then dives into water
     */
    const jump = useCallback(() => {
      setState('jumping')
      stateRef.current = 'jumping'

      // Call onFishJump immediately (hides form)
      onFishJump?.()

      // Play jump animation (frames 76-167)
      fishRef.current?.play(75, 167)

      // Phase 2 (after 840ms): Fish starts moving down
      const timer1 = setTimeout(() => {
        if (stateRef.current === 'jumping') {
          translateY.value = withTiming(fishTravel, {
            duration: 800,
            easing: Easing.in(Easing.cubic),
          })
        }
      }, 840)
      timersRef.current.push(timer1)

      // Phase 3 (after 1640ms): Fish hits water, splash
      const timer2 = setTimeout(() => {
        if (stateRef.current === 'jumping') {
          setState('swimming')
          stateRef.current = 'swimming'

          setShowSplash(true)
          splashRef.current?.play()
          onSplash?.()

          // Continue moving down underwater
          translateY.value = withTiming(fishTravel + SCREEN_HEIGHT / 2, {
            duration: 2000,
            easing: Easing.linear,
          })

          // Fade out fish
          opacity.value = withTiming(0, {
            duration: 1500,
          })
        }
      }, 1640)
      timersRef.current.push(timer2)

      // Phase 4 (after 3640ms): Animation complete
      const timer3 = setTimeout(() => {
        setState('destroyed')
        stateRef.current = 'destroyed'
        onEnd?.()
      }, 3640)
      timersRef.current.push(timer3)
    }, [fishTravel, translateY, opacity, onFishJump, onSplash, onEnd])

    useImperativeHandle(ref, () => ({
      loading,
      stop,
      jump,
    }))

    const fishAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }))

    if (state === 'destroyed') {
      return null
    }

    // Position fish centered on logo
    const fishTop = logoY - 160

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Fish Animation */}
        <Animated.View
          style={[
            styles.fishContainer,
            fishAnimatedStyle,
            { top: 0 - fishTop, width: sizes.width, height: sizes.height },
          ]}
        >
          <LottieView
            ref={fishRef}
            source={animationData}
            style={styles.fish}
            autoPlay={false}
            loop={state === 'loading'}
            speed={1}
          />
        </Animated.View>

        {/* Splash Animation */}
        {showSplash && (
          <View
            style={[
              styles.splashContainer,
              { top: waterSurfaceY - 160, width: sizes.width, height: sizes.height },
            ]}
          >
            <LottieView
              ref={splashRef}
              source={splashData}
              style={styles.splash}
              autoPlay={false}
              loop={false}
              speed={1}
            />
          </View>
        )}
      </View>
    )
  }
)

LoginAnimation.displayName = 'LoginAnimation'

export default LoginAnimation
