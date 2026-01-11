import { IconSymbol } from '@/components/Ui/icon-symbol'
import { useRouter } from 'expo-router'
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { devices } from './Devices.utils'
import { Device } from './DevicesScreen.interfaces'
import { styles } from './DevicesScreen.styles'

export default function Devices() {
  const router = useRouter()

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone':
        return 'phone.fill'
      case 'tablet':
        return 'tablet.fill'
      case 'desktop':
        return 'desktop.fill'
    }
  }

  const handleRemoveDevice = (device: Device) => {
    Alert.alert(
      'Remove Device',
      `Are you sure you want to remove "${device.name}"? You'll need to log in again on that device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => Alert.alert('Device Removed', `${device.name} has been removed.`),
        },
      ]
    )
  }

  const handleLogoutAll = () => {
    Alert.alert(
      'Log Out All Devices',
      "You will be logged out of all devices except this one. You'll need to log in again on other devices.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out All',
          style: 'destructive',
          onPress: () => Alert.alert('Logged Out', 'All other devices have been logged out.'),
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Devices</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <IconSymbol name="info.circle" size={20} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            These are devices that have logged into your account. Remove any you dont recognize.
          </Text>
        </View>

        {/* Devices List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logged In Devices</Text>
          <View style={styles.card}>
            {devices.map((device, index) => (
              <View key={device.id}>
                <View style={styles.deviceRow}>
                  <View style={styles.deviceLeft}>
                    <IconSymbol
                      name={getDeviceIcon(device.type)}
                      size={24}
                      style={styles.deviceIcon}
                    />
                    <View style={styles.deviceInfo}>
                      <View style={styles.deviceNameRow}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        {device.isCurrent && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>This device</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.deviceLocation}>{device.location}</Text>
                      <Text style={styles.deviceLastActive}>Active: {device.lastActive}</Text>
                    </View>
                  </View>
                  {!device.isCurrent && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveDevice(device)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {index < devices.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Logout All Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutAllButton}
            onPress={handleLogoutAll}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutAllText}>Log Out of All Other Devices</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
