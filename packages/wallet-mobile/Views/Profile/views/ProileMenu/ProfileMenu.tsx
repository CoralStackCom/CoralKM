import ActionRow from '@/components/ui/ActionRow'
import Header from '@/components/ui/Header'
import { useUserContext } from '@/providers/UserContext'
import { useRouter } from 'expo-router'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { styles } from './ProfileMenu.styles'
import { menuItems } from './ProfileMenu.utils'

/* Profile Menu Screen Component */

export const MenuScreen: React.FC = () => {
  const router = useRouter()
  const { logout } = useUserContext()

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <Header title="Menu" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <ActionRow key={index} title={item.label} leftIcon={item.icon} onPress={item.onPress} />
          ))}
        </View>
        {/* Logout Button */}
        <View style={styles.logoutCard}>
          <ActionRow
            title="Log Out"
            leftIcon="arrow.right.square"
            rightIcon={null}
            onPress={handleLogout}
            iconColor="#ff3b30"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default MenuScreen
