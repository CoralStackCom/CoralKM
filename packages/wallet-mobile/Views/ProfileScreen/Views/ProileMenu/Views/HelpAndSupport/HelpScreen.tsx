import { IconSymbol } from '@/components/Ui/icon-symbol'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from './HelpSupport.styles'
import { faqItems } from './HelpSupport.utils'

export default function HelpSupportScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@example.com?subject=Support%20Request')
  }

  const handleCallSupport = () => {
    Alert.alert('Call Support', 'Would you like to call our support team?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL('tel:+1800555000') },
    ])
  }

  const handleLiveChat = () => {
    Alert.alert(
      'Live Chat',
      'Live chat is available Monday-Friday, 9 AM - 5 PM PST. Would you like to start a chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Chat',
          onPress: () => Alert.alert('Chat Started', 'A support agent will be with you shortly.'),
        },
      ]
    )
  }

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Thank you for helping us improve! Please describe the issue you encountered.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => Linking.openURL('mailto:bugs@example.com?subject=Bug%20Report'),
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <IconSymbol name="search" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleLiveChat}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#0095f6' }]}>
                <IconSymbol
                  name="message.fill"
                  size={20}
                  style={styles.quickActionEmoji}
                  color="white"
                />
              </View>
              <Text style={styles.quickActionLabel}>Live Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#34c759' }]}>
                <IconSymbol
                  name="mail.fill"
                  size={20}
                  style={styles.quickActionEmoji}
                  color="white"
                />
              </View>
              <Text style={styles.quickActionLabel}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleCallSupport}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#ff9500' }]}>
                <IconSymbol
                  name="phone.fill"
                  size={20}
                  style={styles.quickActionEmoji}
                  color="white"
                />
              </View>
              <Text style={styles.quickActionLabel}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.card}>
            {faqItems.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Text style={styles.faqChevron}>{expandedFaq === index ? '−' : '+'}</Text>
                </TouchableOpacity>
                {expandedFaq === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </View>
                )}
                {index < faqItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.resourceRow} activeOpacity={0.7}>
              <View style={styles.resourceLeft}>
                <IconSymbol name="book" size={24} style={styles.resourceIcon} />
                <View style={styles.resourceText}>
                  <Text style={styles.resourceLabel}>User Guide</Text>
                  <Text style={styles.resourceDescription}>Learn how to use the app</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.resourceRow} activeOpacity={0.7}>
              <View style={styles.resourceLeft}>
                <IconSymbol name="video" size={24} style={styles.resourceIcon} />
                <View style={styles.resourceText}>
                  <Text style={styles.resourceLabel}>Video Tutorials</Text>
                  <Text style={styles.resourceDescription}>Watch step-by-step guides</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.resourceRow}
              onPress={handleReportBug}
              activeOpacity={0.7}
            >
              <View style={styles.resourceLeft}>
                <IconSymbol name="bug" size={24} style={styles.resourceIcon} />
                <View style={styles.resourceText}>
                  <Text style={styles.resourceLabel}>Report a Bug</Text>
                  <Text style={styles.resourceDescription}>Help us improve the app</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>App Version 1.0.0</Text>
            <Text style={styles.appCopyright}>© 2026 CoralKm </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
