import Section from '@/components/contianers/Section'
import SectionTitle from '@/components/contianers/Section/components/SectionTitle'
import ActionRow from '@/components/Ui/ActionRow'
import Button from '@/components/Ui/Button'
import ColorPickerGrid from '@/components/Ui/ColorPickerGrid'
import Header from '@/components/Ui/Header'
import SelectableList from '@/components/Ui/SelectableList'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { AccentColor, Theme } from './Appearance.interfaces'
import { styles } from './Appearance.styles'
import { colors, themes } from './Appearance.utils'

export default function AppearanceScreen() {
  const [theme, setTheme] = useState<Theme>('system')
  const [accentColor, setAccentColor] = useState<AccentColor>('blue')

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Appearance" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Section */}
        <Section style={styles.section}>
          <SectionTitle value="Theme" />
          <SelectableList List={themes} value={theme} onChange={setTheme} />
        </Section>

        {/* Accent Color Section */}
        <Section style={styles.section}>
          <SectionTitle value="Accent Color" />
          <ColorPickerGrid List={colors} value={accentColor} onChange={setAccentColor} />
        </Section>

        {/* Preview Section */}
        <Section style={styles.section}>
          <SectionTitle value="Preview" />
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              {/* TO DO: this component will be deleted so no need to refactor it  */}
              <View
                style={[
                  styles.previewAvatar,
                  { backgroundColor: colors.find(c => c.key === accentColor)?.hex },
                ]}
              />
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>Sample User</Text>
                <Text style={styles.previewSubtitle}>This is how your app looks</Text>
              </View>
            </View>
            <Button
              style={[
                styles.previewButton,
                { backgroundColor: colors.find(c => c.key === accentColor)?.hex },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.previewButtonText}>Sample Button</Text>
            </Button>
          </View>
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
