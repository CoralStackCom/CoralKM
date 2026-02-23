import Section from '@/components/containers/Section'
import { SectionHeader } from '@/components/containers/Section/components/SectionHeader/SectionHeader'
import SectionTitle from '@/components/containers/Section/components/SectionTitle'
import ActionRow from '@/components/ui/ActionRow'
import Header from '@/components/ui/Header'
import SelectableList from '@/components/ui/SelectableList'
import { useTheme } from '@/providers/ThemeProvider'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { styles } from './Appearance.styles'
import { themes } from './Appearance.utils'

/**
 * AppearanceScreen component.
 *
 * Manages appearance settings including theme selection
 * and app icon customization. Wired to ThemeProvider for
 * global theme state management.
 */

export const AppearanceScreen: React.FC = () => {
  const { mode, setMode } = useTheme()

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Appearance" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Appearance" iconName="moon" />
        {/* Theme Section */}
        <Section style={styles.section}>
          <SectionTitle value="Theme" />
          <SelectableList List={themes} value={mode} onChange={setMode} />
        </Section>

        {/* App Icon Section */}
        <Section style={styles.section}>
          <SectionTitle value="App Icon" />
          <ActionRow title="App Icon" description="Default" />
        </Section>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
export default AppearanceScreen
