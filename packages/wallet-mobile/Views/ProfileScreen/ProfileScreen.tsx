import { Background } from '@/components/Background'
import AvatarUpload from '@/components/Ui/AvatarUploading'
import Header from '@/components/Ui/Header'
import { IconSymbol } from '@/components/Ui/icon-symbol'
import { useUserContext } from '@/providers/UserContext'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './PorfileScreen.styles'
import type { ProfileScreenProps } from './profileScreen.interfaces'

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigateSettings, onLogout }) => {
  const router = useRouter()
  const { user, household, updateUser, updateHousehold } = useUserContext()
  const [isEditing, setIsEditing] = useState(false)

  // Local state for editing
  const [editFirstName, setEditFirstName] = useState(user?.firstName || '')
  const [editLastName, setEditLastName] = useState(user?.lastName || '')
  const [editEmail, setEditEmail] = useState(user?.email || '')
  const [editHouseholdName, setEditHouseholdName] = useState(household?.name || '')
  const [editCountry, setEditCountry] = useState(household?.country || '')
  const [editCurrency, setEditCurrency] = useState(household?.currency || '')

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

  const handleCancel = () => {
    setEditFirstName(user?.firstName || '')
    setEditLastName(user?.lastName || '')
    setEditEmail(user?.email || '')
    setEditHouseholdName(household?.name || '')
    setEditCountry(household?.country || '')
    setEditCurrency(household?.currency || '')
    setIsEditing(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Background view="underwater" />
      {/* Header */}
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
            <AvatarUpload uri={user?.avatar} style={styles.avatar} />
          </View>

          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {/* Edit/Save Buttons */}
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

        {/* Content Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Personal Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <IconSymbol name="person.fill" size={20} color="#1B5678" />
              </View>
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>First Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editFirstName}
                    onChangeText={setEditFirstName}
                    placeholder="First Name"
                    placeholderTextColor="#A0A0A0"
                  />
                ) : (
                  <Text style={styles.value}>{user?.firstName}</Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Last Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editLastName}
                    onChangeText={setEditLastName}
                    placeholder="Last Name"
                    placeholderTextColor="#A0A0A0"
                  />
                ) : (
                  <Text style={styles.value}>{user?.lastName}</Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Email Address</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#A0A0A0"
                  />
                ) : (
                  <Text style={styles.value}>{user?.email}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Household Information Card */}
          {household && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconWrapper}>
                  <IconSymbol name="house.fill" size={20} color="#1B5678" />
                </View>
                <Text style={styles.cardTitle}>Household Information</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.householdLogoWrapper}>
                  <AvatarUpload
                    uri={household.logo}
                    size={70}
                    editable={isEditing}
                    onImageChange={newUri => {
                      // Handle logo change if needed
                    }}
                  />
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Household Name</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editHouseholdName}
                      onChangeText={setEditHouseholdName}
                      placeholder="Household Name"
                      placeholderTextColor="#A0A0A0"
                    />
                  ) : (
                    <Text style={styles.value}>{household.name}</Text>
                  )}
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Country</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editCountry}
                      onChangeText={setEditCountry}
                      placeholder="Country"
                      placeholderTextColor="#A0A0A0"
                    />
                  ) : (
                    <Text style={styles.value}>{household.country}</Text>
                  )}
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Currency</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editCurrency}
                      onChangeText={setEditCurrency}
                      placeholder="Currency"
                      placeholderTextColor="#A0A0A0"
                    />
                  ) : (
                    <Text style={styles.value}>{household.currency}</Text>
                  )}
                </View>
              </View>
            </View>
          )}
          {/* Security Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <IconSymbol name="lock.fill" size={20} color="#1B5678" />
              </View>
              <Text style={styles.cardTitle}>Security</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Encryption Seed</Text>
                <Text style={styles.value}>••••••••</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}
export default ProfileScreen
