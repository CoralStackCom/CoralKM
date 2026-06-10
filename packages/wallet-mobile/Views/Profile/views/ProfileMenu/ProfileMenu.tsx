import { Background } from '@/components/Background'
import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useUserContext } from '@/providers/UserContext'
import { useRouter } from 'expo-router'
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import type { MenuItem } from './ProfileMenu.interfaces'
import { styles } from './ProfileMenu.styles'
import { menuSections } from './ProfileMenu.utils'

/**
 * ProfileMenu component.
 *
 * Settings hub for the profile area: a compact account summary followed by
 * grouped, color-coded shortcuts (Account, Preferences, Support) and a
 * sign-out action.
 */
export const MenuScreen: React.FC = () => {
  const router = useRouter()
  const { user, logout } = useUserContext()

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  /** Render a single color-coded menu row. */
  const renderItem = (item: MenuItem, isLast: boolean) => (
    <TouchableOpacity
      key={item.label}
      style={[styles.row, isLast && styles.rowLast]}
      activeOpacity={0.7}
      onPress={item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <View style={[styles.iconChip, { backgroundColor: `${item.color}1A` }]}>
        <IconSymbol name={item.icon} size={22} color={item.color} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowDescription}>{item.description}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#B6C4CE" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Background view="underwater" />
      <Header title="Menu" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Account summary */}
        <TouchableOpacity
          style={styles.summaryCard}
          activeOpacity={0.8}
          onPress={() => router.navigate('/(tabs)/Profile')}
          accessibilityRole="button"
          accessibilityLabel="View profile"
        >
          <View style={styles.avatar}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {fullName || 'Your Profile'}
            </Text>
            {!!user?.email && (
              <Text style={styles.summaryEmail} numberOfLines={1}>
                {user.email}
              </Text>
            )}
            <Text style={styles.summaryLink}>View profile</Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color="#B6C4CE" />
        </TouchableOpacity>

        {/* Grouped sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) =>
                renderItem(item, index === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <IconSymbol name="arrow.right.square" size={20} color="#E0533D" />
          <Text style={styles.logoutLabel}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}
export default MenuScreen
