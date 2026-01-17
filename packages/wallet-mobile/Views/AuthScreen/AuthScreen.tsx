import '@/app/shim'

import React, { useEffect, useRef, useState } from 'react'
import { Animated, View } from 'react-native'

import { AuthScreenProps } from './AuthScreen.interface'
import { styles } from './AuthScreen.style'
import AuthForm from './components/AuthForm/'
import EmailForm from './components/EmailForm/'

/**
 * Authentication screen component with animated background transitions
 */
export const AuthScreen: React.FC<AuthScreenProps> = ({
  onGetOOBCode,
  onAuthenticate,
  isAuthenticated = false,
  disableBackgroundAnimation = false,
  children,
}: AuthScreenProps) => {
  // Component State
  const [backgroundView, setBackgroundView] = useState<'underwater' | 'land' | 'sky'>(
    isAuthenticated ? 'underwater' : 'sky'
  )
  const [showLogin, setShowLogin] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const appScreenOpacity = useRef(new Animated.Value(0)).current

  /**
   * Update background view based on authentication state
   */
  useEffect(() => {
    if (!isLogin) {
      setBackgroundView(isAuthenticated ? 'underwater' : 'sky')
      setShowLogin(!isAuthenticated)
    }
  }, [isAuthenticated, isLogin])

  /**
   * Handle app screen fade-in animation
   */
  useEffect(() => {
    if (backgroundView === 'underwater') {
      Animated.timing(appScreenOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start()
    } else {
      appScreenOpacity.setValue(0)
    }
  }, [backgroundView, appScreenOpacity])

  /**
   * Handle splash screen transition
   */
  const onSplash = () => {
    setBackgroundView('underwater')
  }

  /**
   * Show email form with sky background
   */
  const onShowEmailForm = () => {
    setBackgroundView('sky')
  }

  /**
   * Handle authentication with login state
   */
  const handleAuthenticate = async (oobCode: string) => {
    setIsLogin(true)
    return await onAuthenticate(oobCode)
  }

  // Render
  return (
    <View style={styles.container}>
      {showLogin ? (
        <View style={styles.authContainer}>
          {backgroundView === 'land' && (
            <View style={styles.authScreen}>
              <AuthForm
                focused={backgroundView === 'land'}
                onAuthenticate={handleAuthenticate}
                onSplash={onSplash}
                onBack={onShowEmailForm}
              />
            </View>
          )}

          {backgroundView === 'sky' && (
            <View style={styles.emailScreen}>
              <EmailForm
                focused={backgroundView === 'sky'}
                onGetOOBCode={onGetOOBCode}
                onNext={() => setBackgroundView('land')}
              />
            </View>
          )}
        </View>
      ) : (
        <Animated.View style={[styles.appScreen, { opacity: appScreenOpacity }]}>
          {children}
        </Animated.View>
      )}
    </View>
  )
}
