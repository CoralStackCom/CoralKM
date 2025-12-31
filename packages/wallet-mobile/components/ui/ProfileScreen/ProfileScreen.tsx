import { IconSymbol } from '@/components/others/icon-symbol'
import { useUserContext } from '@/providers/UserContext'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from './PorfileScreen.styles'
import { ProfileScreenProps } from './profileScreen.interfaces'

export default function ProfileScreen({ onNavigateSettings, onLogout }: ProfileScreenProps) {
  const router = useRouter()
  const { user, household, updateUser, updateHousehold } = useUserContext()
  const [isEditing, setIsEditing] = useState(false)
  // Local state for editing
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editHouseholdName, setEditHouseholdName] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [editCurrency, setEditCurrency] = useState('')

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
      {/* <IconSymbol name="person.fill" size={40} color="#1B5678" /> */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/ProfileMenu')}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=1' }}
            style={styles.avatar}
          />
          <Text style={styles.displayName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Edit/Save Button */}
        <View style={styles.actionButtonContainer}>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle" size={40} color="#1B5678" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>First Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editFirstName}
                  onChangeText={setEditFirstName}
                  placeholder="First Name"
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
                />
              ) : (
                <Text style={styles.value}>{user?.lastName}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.value}>{user?.email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Household Information Section */}
        {household && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="house.fill" size={40} color="#1B5678" />
              <Text style={styles.sectionTitle}> Household Information</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.householdHeader}>
                <Image source={{ uri: household.logo }} style={styles.householdLogo} />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Household Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editHouseholdName}
                    onChangeText={setEditHouseholdName}
                    placeholder="Household Name"
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
                  />
                ) : (
                  <Text style={styles.value}>{household.currency}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Security Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="lock.fill" size={40} color="#1B5678" />
            <Text style={styles.sectionTitle}> Security</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Encryption Seed</Text>
              <Text style={styles.value}>••••••••</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
