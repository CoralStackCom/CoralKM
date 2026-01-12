import { useUserContext } from '@/providers/UserContext'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { EmailFormProps } from './EmailForm.interface'
import { styles } from './EmailForm.style'

/**
 * Reset password form component for email verification
 */
export default function ResetPasswordForm({
  email: defaultEmail,
  focused = false,
  onGetOOBCode,
  onNext,
}: EmailFormProps) {
  // Component State
  const [email, setEmail] = useState(defaultEmail || '')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const { user, setUser } = useUserContext()
  /**
   * Update email when defaultEmail prop changes
   */
  useEffect(() => {
    setEmail(defaultEmail || '')
  }, [defaultEmail])

  /**
   * Autofocus input when form is focused
   */
  useEffect(() => {
    if (focused) {
      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [focused])

  useEffect(() => {
    if (user?.id) {
      setUser({ ...user, email: email })
    }
  }, [email])

  /**
   * Handle OOB code request
   */
  const handleGetOOBCode = () => {
    setIsLoading(true)
    onGetOOBCode(email)
      .then(() => {
        setIsEmailSent(true)
        setIsLoading(false)
      })
      .catch(err => {
        setErrorMsg(String(err))
        setIsLoading(false)
      })
  }

  /**
   * Handle navigation to login/next step
   */
  const handleShowLogin = () => {
    setTimeout(() => {
      setEmail('')
      setIsLoading(false)
      setIsEmailSent(false)
    }, 500)
    onNext()
  }

  // Render
  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <View style={styles.logoBox}>
          <Image
            source={require('@/assets/svg/logo_black.png')}
            style={{ height: 50, resizeMode: 'contain' }}
          />
        </View>

        <View>
          {isEmailSent ? (
            <View>
              <Text style={styles.title}>Check Your Inbox!</Text>
              <Text style={styles.desc}>
                An email with a 6-digit code has been sent. If you can’t find it, check your Spam
                folder, try again, or contact support.
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleShowLogin}>
                <Text style={styles.btnText}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>Enter Your Email</Text>
              {errorMsg !== '' && <Text style={styles.error}>{errorMsg}</Text>}
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="aquaman@atlantis.com"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
              />
              <TouchableOpacity
                style={[styles.button, isLoading && styles.disabled]}
                onPress={handleGetOOBCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Send Code to Email</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
