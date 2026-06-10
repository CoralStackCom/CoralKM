import { Background } from '@/components/Background'
import { ErrorBoundary } from '@/components/containers/ErrorBoundary'
import { AuthProvider } from '@/providers/AuthContext'
import { PreferencesProvider } from '@/providers/preferences'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { UserProvider } from '@/providers/UserContext'
import { WalletProvider } from '@/providers/wallet'
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
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <ErrorBoundary>
          <Background view="underwater" />
          <WalletProvider gatewayDID="did:web:coralkm-wallet-gateway.developers-6d6.workers.dev">
            <AuthProvider>
              <UserProvider>
                <PreferencesProvider>
                  {isAuthenticated ? <Slot initialRouteName="tabs" /> : <Slot initialRouteName="index" />}
                </PreferencesProvider>
              </UserProvider>
            </AuthProvider>
          </WalletProvider>
        </ErrorBoundary>
      </View>
    </ThemeProvider>
  )
}
