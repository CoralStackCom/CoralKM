import { Background } from '@/components/Background'
import Section from '@/components/containers/Section'
import { SectionTitle } from '@/components/containers/Section/components/SectionTitle/SectionTitle'
import AvatarUpload from '@/components/ui/AvatarUploading'
import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Input } from '@/components/ui/Input'
import { useUserContext } from '@/providers/UserContext'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import type { ProfileScreenProps } from './ProfileScreen.interfaces'
import { styles } from './ProfileScreen.styles'

/**
 * ProfileScreen component.
 *
 * Displays the user's profile with editable personal and household
 * information cards. Includes avatar upload, inline editing mode,
 * and navigation to the profile menu.
 */
export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigateSettings, onLogout }) => {
  const router = useRouter()
  const { user, household, updateUser, updateHousehold } = useUserContext()
  const [isEditing, setIsEditing] = useState(false)

  const [editFirstName, setEditFirstName] = useState(user?.firstName || '')
  const [editLastName, setEditLastName] = useState(user?.lastName || '')
  const [editEmail, setEditEmail] = useState(user?.email || '')
  const [editHouseholdName, setEditHouseholdName] = useState(household?.name || '')
  const [editCountry, setEditCountry] = useState(household?.country || '')
  const [editCurrency, setEditCurrency] = useState(household?.currency || '')

  /** Saves edited profile and household data */
  const handleSave = () => {
    if (user) {
      updateUser({
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
      })
    }
    if (household) {
      updateHousehold({
        name: editHouseholdName,
        country: editCountry,
        currency: editCurrency,
      })
    }
    setIsEditing(false)
  }

  /** Resets form state and exits editing mode */
  const handleCancel = () => {
    setEditFirstName(user?.firstName || '')
    setEditLastName(user?.lastName || '')
    setEditEmail(user?.email || '')
    setEditHouseholdName(household?.name || '')
    setEditCountry(household?.country || '')
    setEditCurrency(household?.currency || '')
    setIsEditing(false)
  }

  /** Renders an info row with label and either editable input or display value */
  const renderInfoRow = (
    label: string,
    value: string | undefined,
    editValue: string,
    onChangeText: (text: string) => void,
    options?: { keyboardType?: 'default' | 'email-address'; autoCapitalize?: 'none' | 'sentences' }
  ) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <Input
          style={styles.input}
          value={editValue}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor="#A0A0A0"
          keyboardType={options?.keyboardType}
          autoCapitalize={options?.autoCapitalize}
        />
      ) : (
        <Text style={styles.value}>{value ?? ''}</Text>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Background view="underwater" />
      <Header
        title="Profile"
        rightComponent={
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/ProfileMenu')}>
            <IconSymbol name="line.3.horizontal" size={40} color="#7eadc9ff" />
          </TouchableOpacity>
        }
        showBackButton={false}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarWrapper}>
            <AvatarUpload uri={user?.avatar ?? ''} style={styles.avatar} />
          </View>

          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <IconSymbol name="pencil" size={16} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <IconSymbol name="checkmark" size={16} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content Cards */}
        <View style={styles.cardsContainer}>
          {/* Personal Information */}
          <Section>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <IconSymbol name="person.fill" size={20} color="#1B5678" />
              </View>
              <SectionTitle value="Personal Information" />
            </View>

            <View style={styles.cardContent}>
              {renderInfoRow('First Name', user?.firstName, editFirstName, setEditFirstName)}
              <View style={styles.divider} />
              {renderInfoRow('Last Name', user?.lastName, editLastName, setEditLastName)}
              <View style={styles.divider} />
              {renderInfoRow('Email Address', user?.email, editEmail, setEditEmail, {
                keyboardType: 'email-address',
                autoCapitalize: 'none',
              })}
            </View>
          </Section>

          {/* Household Information */}
          {household && (
            <Section>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconWrapper}>
                  <IconSymbol name="house.fill" size={20} color="#1B5678" />
                </View>
                <SectionTitle value="Household Information" />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.householdLogoWrapper}>
                  <AvatarUpload
                    uri={household.logo}
                    size={70}
                    editable={isEditing}
                    onImageChange={() => {}}
                  />
                </View>

                {renderInfoRow('Household Name', household.name, editHouseholdName, setEditHouseholdName)}
                <View style={styles.divider} />
                {renderInfoRow('Country', household.country, editCountry, setEditCountry)}
                <View style={styles.divider} />
                {renderInfoRow('Currency', household.currency, editCurrency, setEditCurrency)}
              </View>
            </Section>
          )}

          {/* Security */}
          <Section>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <IconSymbol name="lock.fill" size={20} color="#1B5678" />
              </View>
              <SectionTitle value="Security" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Encryption Seed</Text>
                <Text style={styles.value}>••••••••</Text>
              </View>
            </View>
          </Section>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}
export default ProfileScreen
