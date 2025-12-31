import { IconSymbol } from '@/components/others/icon-symbol'
import { useUserContext } from '@/providers/UserContext'
import { useRouter } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MenuItem } from './Profilemenu.interfaces'

export default function MenuScreen() {
  const router = useRouter()
  const { logout } = useUserContext()

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  const menuItems: MenuItem[] = [
    {
      icon: 'gear',
      label: 'Settings',
      onPress: () => router.push('/Settings'),
    },
    {
      icon: 'lock',
      label: 'Privacy & Security',
      onPress: () => console.log('Privacy & Security'),
    },
    // {
    //   icon: 'notifications.fill',
    //   label: 'Notifications',
    //   onPress: () => console.log('Notifications'),
    // },
    {
      icon: 'moon',
      label: 'Appearance',
      onPress: () => console.log('Appearance'),
    },
    {
      icon: 'smartphone',
      label: 'Devices',
      onPress: () => console.log('Devices'),
    },
    // {
    //   icon: 'help.fill',
    //   label: 'Help & Support',
    //   onPress: () => console.log('Help & Support'),
    // },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Profile')}>
          <IconSymbol name="arrow.left" size={24} style={styles.backIcon} color="#1B5678" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name={item.icon} size={20} style={styles.menuIcon} color="#1B5678" />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                name="arrow.right.square"
                size={20}
                style={styles.logoutIcon}
                color="#ff3b30"
              />
              <Text style={styles.logoutLabel}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backIcon: {
    fontSize: 24,
    color: '#1B5678',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5678',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  chevron: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff3b30',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 48,
  },
})
