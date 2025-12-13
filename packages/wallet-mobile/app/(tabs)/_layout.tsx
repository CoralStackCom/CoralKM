import '../shim'

import { IconSymbol } from '@/components/others/icon-symbol'
import UnlockScreen from '@/components/ui/UnlockScreen/UnlockScreen'
import { AuthProvider, useAuth } from '@/providers/AuthContext'
import { WalletProvider } from '@/providers/wallet'
import { Tabs, usePathname } from 'expo-router'
import React from 'react'
import { Animated, Text, TouchableOpacity } from 'react-native'
import { styles } from './layout.style'

interface TabButtonProps {
  label: string
  iconName: any
  isFocused: boolean
  onPress: (...args: any[]) => void
}
const MAIN_COLOR = '#1B5678'

const TabButton: React.FC<TabButtonProps> = ({ label, iconName, isFocused, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(isFocused ? 1.1 : 1)).current

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.1 : 1,
      useNativeDriver: true,
    }).start()
  }, [isFocused, scaleAnim])

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.tabButtonContainer}>
      <Animated.View
        style={[
          styles.tabButton,
          {
            backgroundColor: isFocused ? '#fff' : 'transparent',
            borderRadius: isFocused ? 16 : 0,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <IconSymbol name={iconName} size={24} color={isFocused ? MAIN_COLOR : '#fff'} />
        <Text style={[styles.tabLabel, { color: isFocused ? MAIN_COLOR : '#fff' }]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

function TabsContent() {
  const pathname = usePathname()
  const { isLocked } = useAuth()

  if (isLocked) {
    return <UnlockScreen />
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="Home/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/Home'}
              label="Home"
              iconName="house"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Generator/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/Generator'}
              label="Generator"
              iconName="sparkles"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Scanner/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/Scanner'}
              label="Scanner"
              iconName="qrcode"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/Settings'}
              label="Settings"
              iconName="gear"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/wallet'}
              label="Wallet"
              iconName="MessageCircle"
            />
          ),
        }}
      />
    </Tabs>
  )
}
export default function TabLayout() {
  return (
    <WalletProvider gatewayDID="did:web:coralkm-wallet-gateway.developers-6d6.workers.dev">
      <AuthProvider>
        <TabsContent />
      </AuthProvider>
    </WalletProvider>
  )
}
