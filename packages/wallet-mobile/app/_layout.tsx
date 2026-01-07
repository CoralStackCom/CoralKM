import './shim'

import { Background } from '@/components/Shared/Background'
import { AuthProvider } from '@/providers/AuthContext'
import { UserProvider } from '@/providers/UserContext'
import { Slot } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  // Simulate loading user session
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = false
      setTimeout(() => setIsAuthenticated(loggedIn), 500) // simulate delay
    }
    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Background view="underwater" />
      <AuthProvider>
        <UserProvider>
          {isAuthenticated ? <Slot initialRouteName="tabs" /> : <Slot initialRouteName="index" />}
        </UserProvider>
      </AuthProvider>
    </View>
  )
}
