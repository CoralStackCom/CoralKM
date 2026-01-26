import OOBField from '@/components/OOBField'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { LoginAnimation, type LoginAnimationRef } from '../LoginAnimation'
import { AuthFormProps } from './AuthForm.interface'
import { styles } from './AuthForm.style'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

/**
 * Authentication form with fish jump animation
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  focused = false,
  onAuthenticate,
  onBack,
  onSplash,
}) => {
  // State
  const [showAuthForm, setShowAuthForm] = useState(true)
  const [displayError, setDisplayError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [showLogo, setshowLogo] = useState(true)
  const [sizes, setsizes] = useState({ width: 0, height: 0 } as any | boolean)
  const [logoY, setLogoY] = useState(299)
  const inputRef = useRef<TextInput>(null)
  const animationRef = useRef<LoginAnimationRef>(null)
  const logoRef = useRef<View>(null)

  // Form opacity animation
  const formOpacity = useSharedValue(1)

  // Water surface - adjust based on your Background component
  const waterSurfaceY = SCREEN_HEIGHT * 0.6

  /**
   * Measure logo position after layout
   */
  const handleLogoLayout = useCallback(() => {
    // Use setTimeout to ensure layout is complete
    setTimeout(() => {
      logoRef.current?.measureInWindow((x, y, width, height) => {
        // Get the center Y position of the logo
        const centerY = y + height / 2
        setLogoY(centerY)
      })
    }, 100)
  }, [])

  /**
   * Autofocus input
   */
  useEffect(() => {
    if (focused) {
      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [focused])

  /**
   * Handle OOB code submission
   */
  const handleAuthentication = async (code: string) => {
    setshowLogo(false)
    setsizes({ width: 240, height: 320 })
    setIsLoading(true)
    setDisplayError(undefined)

    // Start fish swimming animation
    animationRef.current?.loading()

    try {
      // Success - trigger jump
      animationRef.current?.jump()
      await onAuthenticate(code)
    } catch (err) {
      // Error - stop animation
      animationRef.current?.stop()
      setDisplayError(String(err))
      setIsLoading(false)
    }
  }
  /**
   * Called when fish starts jumping - hide form
   */
  const handleFishJump = useCallback(() => {
    formOpacity.value = withTiming(0, { duration: 5000 })
    setTimeout(() => setShowAuthForm(false), 5000)
  }, [formOpacity])

  /**
   * Called when fish hits water - transition background
   */
  const handleSplash = useCallback(() => {
    onSplash()
  }, [onSplash])

  /**
   * Called when animation ends
   */
  const handleAnimationEnd = useCallback(() => {
    // Reset everything for potential re-use
    setIsLoading(false)
    setShowAuthForm(true)
    formOpacity.value = 1
    setsizes({ width: 0, height: 0 })
    // Re-show animation after reset
    setTimeout(() => setsizes({ width: 240, height: 320 }), 100)
  }, [formOpacity])

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }))
  return (
    <View style={styles.container}>
      {/* Form */}
      {showAuthForm && (
        <Animated.View style={[styles.formBox, formAnimatedStyle]}>
          {/* Logo - fish animation positions relative to this */}
          <View ref={logoRef} style={styles.logoContainer} onLayout={handleLogoLayout}>
            {showLogo && (
              <Image source={require('@/assets/svg/logo_black.png')} style={styles.logo} />
            )}
          </View>

          <LoginAnimation
            ref={animationRef}
            onFishJump={handleFishJump}
            onSplash={handleSplash}
            onEnd={handleAnimationEnd}
            waterSurfaceY={waterSurfaceY}
            logoY={logoY}
            sizes={sizes}
          />

          <Text style={styles.title}>Enter Your Verification Code</Text>

          {displayError && <Text style={styles.error}>{displayError}</Text>}

          <OOBField digitCount={6} onSubmit={handleAuthentication} />

          <View style={styles.formBottom}>
            <Text style={styles.bottomText}>{"Didn't Receive Your Code?"}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onBack()
                setDisplayError(undefined)
              }}
              disabled={isLoading}
            >
              <Text style={styles.btnText}>Go Back</Text>
            </TouchableOpacity>
            {/* Fish Animation - outside form so it can overlay */}
          </View>
        </Animated.View>
      )}
    </View>
  )
}
