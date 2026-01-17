import { ListCard } from '@/components/contianers/ListCard'
import { Badge } from '@/components/contianers/ListCard/components/Badge/Badge'
import { ListItem } from '@/components/contianers/ListCard/components/ListItem/ListItem'
import { ListItemMeta } from '@/components/contianers/ListCard/components/ListItemMeta/ListItemMeta'
import Section from '@/components/contianers/Section'
import { SectionHeader } from '@/components/contianers/Section/components/SectionHeader/SectionHeader'
import SectionTitle from '@/components/contianers/Section/components/SectionTitle'
import { ActionButton } from '@/components/Ui/Buttons/ActionButton'
import Header from '@/components/Ui/Header'
import { IconSymbol } from '@/components/Ui/icon-symbol'
import InfoBanner from '@/components/Ui/InfoBanner'
import React from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { devices, getDeviceIcon, handleLogoutAll, handleRemoveDevice } from './Devices.utils'
import { styles } from './DevicesScreen.styles'

/* Devices Screen Component */

export const Devices: React.FC = () => {
  // Render
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Devices" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Logged In Devices" iconName="smartphone" />
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
