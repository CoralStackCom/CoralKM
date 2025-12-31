import '../shim'

import { IconSymbol } from '@/components/others/icon-symbol'
import UnlockScreen from '@/components/ui/UnlockScreen/UnlockScreen'
import { AuthProvider, useAuth } from '@/providers/AuthContext'
import { WalletProvider } from '@/providers/wallet'
import { Tabs, usePathname } from 'expo-router'
import React from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native'

interface TabButtonProps {
  label: string
  iconName: any
  isFocused: boolean
  onPress: (...args: any[]) => void
}

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
        <IconSymbol name={iconName} size={24} color={isFocused ? '#1B5678' : '#fff'} />
        <Text style={[styles.tabLabel, { color: isFocused ? '#1B5678' : '#fff' }]}>{label}</Text>
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
        name="Wallet/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/wallet'}
              label="Wallet"
              iconName="person.text.rectangle"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Info/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/Info'}
              label="Info"
              iconName="info.circle"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile/index"
        options={{
          tabBarButton: ({ onPress }) => (
            <TabButton
              onPress={onPress!}
              isFocused={pathname === '/(tabs)/Profile'}
              label="Profile"
              iconName="person.fill"
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 80,
    paddingBottom: 40,
    // borderRadius: 30,
    backgroundColor: '#1B5678',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: 'center',
  },
  tabButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    height: 30,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
})
