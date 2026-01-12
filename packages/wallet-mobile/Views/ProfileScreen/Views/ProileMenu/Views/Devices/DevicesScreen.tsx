import { ListCard } from '@/components/contianers/ListCard'
import { Badge } from '@/components/contianers/ListCard/components/Badge/Badge'
import { ListItem } from '@/components/contianers/ListCard/components/ListItem/ListItem'
import { ListItemMeta } from '@/components/contianers/ListCard/components/ListItemMeta/ListItemMeta'
import Section from '@/components/contianers/Section'
import SectionTitle from '@/components/contianers/Section/components/SectionTitle'
import { ActionButton } from '@/components/Ui/Buttons/ActionButton'
import Header from '@/components/Ui/Header'
import { IconSymbol } from '@/components/Ui/icon-symbol'
import InfoBanner from '@/components/Ui/InfoBanner'
import { useRouter } from 'expo-router'
import React from 'react'
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
      <Header title="Devices" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <Section>
          <InfoBanner icon={<IconSymbol name="info.circle.fill" size={20} color="#1B5678" />}>
            These are devices that have logged into your account. Remove any you dont recognize.
          </InfoBanner>
        </Section>
        {/* Devices List */}
        <Section>
          <SectionTitle value="Logged In Devices" />
          <ListCard>
            {devices.map((device, index) => (
              <ListItem
                key={index}
                left={
                  <>
                    <IconSymbol
                      name={getDeviceIcon(device.type)}
                      size={24}
                      style={styles.deviceIcon}
                    />

                    <ListItemMeta
                      title={device.name}
                      subtitle={device.location}
                      caption={`Active: ${device.lastActive}`}
                      badge={device.isCurrent ? <Badge label="This device" /> : null}
                    />
                  </>
                }
                right={
                  !device.isCurrent && (
                    <TouchableOpacity
                      onPress={() => handleRemoveDevice(device)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )
                }
              />
            ))}
          </ListCard>
        </Section>

        {/* Logout All Button */}
        <Section>
          <ActionButton
            // style={styles.logoutAllButton}
            label="Log Out of All Other Devices"
            onPress={handleLogoutAll}
          />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
