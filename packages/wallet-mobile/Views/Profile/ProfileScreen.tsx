import { Background } from '@/components/Background'
import AvatarUpload from '@/components/ui/AvatarUploading'
import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import type { IconSymbolName } from '@/components/ui/icon-symbol'
import { Input } from '@/components/ui/Input'
import { StateView } from '@/components/ui/StateView'
import { useFormValidation, validators } from '@/hooks'
import { useUserContext } from '@/providers/UserContext'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import type { ProfileScreenProps } from './ProfileScreen.interfaces'
import { styles } from './ProfileScreen.styles'

const schema = {
  firstName: [
    validators.required('First Name is required'),
    validators.name(),
    validators.maxLength(40),
  ],
  lastName: [
    validators.required('Last Name is required'),
    validators.name(),
    validators.maxLength(40),
  ],
  email: [
    validators.required('Email is required'),
    validators.email('Invalid email format'),
    validators.maxLength(254),
  ],
  householdName: [
    validators.required('Household Name is required'),
    validators.minLength(2),
    validators.maxLength(60),
  ],
  country: [validators.required('Country is required'), validators.name(), validators.maxLength(56)],
  currency: [
    validators.required('Currency is required'),
    validators.currencyCode(),
  ],
}

/**
 * ProfileScreen component.
 *
 * Displays the user's profile with a hero header and editable personal,
 * household, and security cards. Supports avatar upload, inline editing, and
 * navigation to the profile menu.
 */
export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const router = useRouter()
  const { user, household, isLoading, updateUser, updateHousehold } = useUserContext()
  const [isEditing, setIsEditing] = useState(false)

  const [editFirstName, setEditFirstName] = useState(user?.firstName || '')
  const [editLastName, setEditLastName] = useState(user?.lastName || '')
  const [editEmail, setEditEmail] = useState(user?.email || '')
  const [editHouseholdName, setEditHouseholdName] = useState(household?.name || '')
  const [editCountry, setEditCountry] = useState(household?.country || '')
  const [editCurrency, setEditCurrency] = useState(household?.currency || '')

  const { errors, validateAll, clearFieldError, clearErrors } = useFormValidation(schema)

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()

  /** Saves edited profile and household data */
  const handleSave = () => {
    const values: Record<string, string> = {
      firstName: editFirstName,
      lastName: editLastName,
      email: editEmail,
      householdName: editHouseholdName,
      country: editCountry,
      currency: editCurrency,
    }

    if (!validateAll(values)) return

    if (user) {
      updateUser({ firstName: editFirstName, lastName: editLastName, email: editEmail })
    }
    if (household) {
      updateHousehold({ name: editHouseholdName, country: editCountry, currency: editCurrency })
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
    clearErrors()
  }

  /** Renders an info row with label and either editable input or display value */
  const renderInfoRow = (
    label: string,
    value: string | undefined,
    editValue: string,
    onChangeText: (text: string) => void,
    fieldName: string,
    isLast = false,
    options?: { keyboardType?: 'default' | 'email-address'; autoCapitalize?: 'none' | 'sentences' }
  ) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <Input
          style={styles.input}
          value={editValue}
          onChangeText={(text) => {
            onChangeText(text)
            clearFieldError(fieldName)
          }}
          placeholder={label}
          placeholderTextColor="#A0A0A0"
          keyboardType={options?.keyboardType}
          autoCapitalize={options?.autoCapitalize}
          error={errors[fieldName]}
        />
      ) : (
        <Text style={styles.value}>{value || '—'}</Text>
      )}
    </View>
  )

  /** Renders a card header with a tinted icon chip. */
  const renderCardHeader = (icon: IconSymbolName, title: string, color: string) => (
    <View style={styles.cardHeader}>
      <View style={[styles.cardIconWrapper, { backgroundColor: `${color}1A` }]}>
        <IconSymbol name={icon} size={20} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  )

  // Loading state while persisted profile hydrates from secure storage.
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Background view="underwater" />
        <Header title="Profile" showBackButton={false} />
        <StateView variant="loading" title="Loading your profile…" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Background view="underwater" />
      <Header
        title="Profile"
        rightComponent={
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/ProfileMenu')}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <IconSymbol name="line.3.horizontal" size={28} color="#13415C" />
          </TouchableOpacity>
        }
        showBackButton={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero header */}
        <View style={styles.heroCard}>
          <View style={styles.heroBand} />
          <View style={styles.avatarWrapper}>
            <AvatarUpload
              uri={user?.avatar ?? ''}
              style={styles.avatar}
              editable={isEditing}
              onImageChange={(newUri) => updateUser({ avatar: newUri })}
            />
          </View>

          <Text style={styles.userName}>{fullName || 'Your Profile'}</Text>
          {!!user?.email && <Text style={styles.userEmail}>{user.email}</Text>}

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
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content cards */}
        <View style={styles.cardsContainer}>
          {/* Personal Information */}
          <View style={styles.card}>
            {renderCardHeader('person.fill', 'Personal Information', '#2B86B8')}
            <View style={styles.cardContent}>
              {renderInfoRow('First Name', user?.firstName, editFirstName, setEditFirstName, 'firstName')}
              {renderInfoRow('Last Name', user?.lastName, editLastName, setEditLastName, 'lastName')}
              {renderInfoRow('Email Address', user?.email, editEmail, setEditEmail, 'email', true, {
                keyboardType: 'email-address',
                autoCapitalize: 'none',
              })}
            </View>
          </View>

          {/* Household Information */}
          {household && (
            <View style={styles.card}>
              {renderCardHeader('house.fill', 'Household', '#2BB3A3')}
              <View style={styles.cardContent}>
                <View style={styles.householdLogoWrapper}>
                  <AvatarUpload
                    uri={household.logo}
                    size={70}
                    editable={isEditing}
                    onImageChange={(newUri) => updateHousehold({ logo: newUri })}
                  />
                </View>
                {renderInfoRow('Household Name', household.name, editHouseholdName, setEditHouseholdName, 'householdName')}
                {renderInfoRow('Country', household.country, editCountry, setEditCountry, 'country')}
                {renderInfoRow('Currency', household.currency, editCurrency, setEditCurrency, 'currency', true)}
              </View>
            </View>
          )}

          {/* Security */}
          <View style={styles.card}>
            {renderCardHeader('lock.fill', 'Security', '#F2A93B')}
            <View style={styles.cardContent}>
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.label}>Encryption Seed</Text>
                <View style={styles.secureValue}>
                  <IconSymbol name="lock.fill" size={14} color="#2BB3A3" />
                  <Text style={styles.value}>••••••••</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}
export default ProfileScreen
