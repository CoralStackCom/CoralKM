import { IconSymbol } from '@/components/Ui/icon-symbol'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './Appearance.styles'

type Theme = 'light' | 'dark' | 'system'
type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink'

export default function AppearanceScreen() {
  const router = useRouter()
  const [theme, setTheme] = useState<Theme>('system')
  const [accentColor, setAccentColor] = useState<AccentColor>('blue')

  const themes: { key: Theme; label: string; icon: string }[] = [
    { key: 'light', label: 'Light', icon: 'wb-sunny' },
    { key: 'dark', label: 'Dark', icon: 'moon.fill' },
    { key: 'system', label: 'System', icon: 'gear' },
  ]

  const colors: { key: AccentColor; hex: string }[] = [
    { key: 'blue', hex: '#1B5678' },
    { key: 'green', hex: '#34c759' },
    { key: 'purple', hex: '#af52de' },
    { key: 'orange', hex: '#ff9500' },
    { key: 'pink', hex: '#ff2d55' },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.card}>
            {themes.map((item, index) => (
              <View key={item.key}>
                <TouchableOpacity
                  style={styles.themeRow}
                  onPress={() => setTheme(item.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeLeft}>
                    <IconSymbol name={item.icon} size={24} style={styles.themeIcon} />
                    <Text style={styles.themeLabel}>{item.label}</Text>
                  </View>
                  <View
                    style={[styles.radioOuter, theme === item.key && styles.radioOuterSelected]}
                  >
                    {theme === item.key && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
                {index < themes.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Accent Color Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accent Color</Text>
          <View style={styles.card}>
            <View style={styles.colorGrid}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color.key}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color.hex },
                    accentColor === color.key && styles.colorButtonSelected,
                  ]}
                  onPress={() => setAccentColor(color.key)}
                  activeOpacity={0.8}
                >
                  {accentColor === color.key && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
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
            <TouchableOpacity
              style={[
                styles.previewButton,
                { backgroundColor: colors.find(c => c.key === accentColor)?.hex },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.previewButtonText}>Sample Button</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Icon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Icon</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.iconRow} activeOpacity={0.7}>
              <View style={styles.iconLeft}>
                <View style={styles.appIconPreview}>
                  <Text style={styles.appIconText}>$</Text>
                </View>
                <View style={styles.iconText}>
                  <Text style={styles.iconLabel}>App Icon</Text>
                  <Text style={styles.iconDescription}>Default</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
