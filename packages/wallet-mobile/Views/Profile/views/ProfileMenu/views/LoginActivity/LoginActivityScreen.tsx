import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import type { IconSymbolName } from '@/components/ui/icon-symbol'
import { StateView } from '@/components/ui/StateView'
import { palette } from '@/constants/design'
import { SessionService, type LoginSession } from '@/providers/auth/session-service'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './LoginActivity.styles'

/** Map a session method to an icon + label. */
const methodMeta = (method: LoginSession['method']): { icon: IconSymbolName; label: string } => {
  switch (method) {
    case 'biometric':
      return { icon: 'touch.fill', label: 'Biometric unlock' }
    case 'device':
      return { icon: 'lock.fill', label: 'Device passcode' }
    default:
      return { icon: 'person.fill', label: 'Signed in' }
  }
}

/**
 * Login Activity screen.
 *
 * Lists the real sign-in / unlock sessions recorded on this device.
 */
export const LoginActivityScreen: React.FC = () => {
  const [sessions, setSessions] = useState<LoginSession[] | null>(null)

  useEffect(() => {
    SessionService.getAll().then(setSessions)
  }, [])

  const handleClear = async () => {
    await SessionService.clear()
    setSessions([])
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Login Activity" />
      {sessions === null ? (
        <StateView variant="loading" title="Loading activity…" />
      ) : sessions.length === 0 ? (
        <StateView
          variant="empty"
          icon="location"
          title="No activity yet"
          message="Sign-ins and unlocks on this device will appear here."
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            Recent sign-ins and unlocks on this device, most recent first.
          </Text>
          {sessions.map((s, index) => {
            const meta = methodMeta(s.method)
            return (
              <View key={s.id} style={styles.row}>
                <View style={styles.iconChip}>
                  <IconSymbol name={meta.icon} size={20} color={palette.navy} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{s.device}</Text>
                  <Text style={styles.rowSubtitle}>
                    {meta.label} · {new Date(s.timestamp).toLocaleString()}
                  </Text>
                </View>
                {index === 0 && <Text style={styles.current}>Latest</Text>}
              </View>
            )
          })}
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Clear Activity</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default LoginActivityScreen
