import Section from '@/components/contianers/Section'
import SectionTitle from '@/components/contianers/Section/components/SectionTitle'
import { AccordionItem } from '@/components/Ui/AccordionItem/AccordionItem'
import ActionRow from '@/components/Ui/ActionRow'
import { QuickActionButton } from '@/components/Ui/Buttons/QuickActionButton'
import Header from '@/components/Ui/Header'
import { SearchInput } from '@/components/Ui/SearchInput'
import { useState } from 'react'
import { Alert, Linking, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { styles } from './HelpSupport.styles'
import { faqItems } from './HelpSupport.utils'

export default function HelpSupportScreen() {
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
      <Header title="Help & Support" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <Section>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search help articles..."
            placeholderTextColor="#999"
          />
        </Section>

        {/* Quick Actions */}
        <Section>
          <SectionTitle value="Contact Us" style={styles.sectionTitle} />
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              label="Live Chat"
              iconName="message.fill"
              iconBackgroundColor="#0095f6"
              onPress={handleLiveChat}
            />
            <QuickActionButton
              label="Email"
              iconName="mail.fill"
              iconBackgroundColor="#34c759"
              onPress={handleContactSupport}
            />
            <QuickActionButton
              label="Call"
              iconName="phone.fill"
              iconBackgroundColor="#ff9500"
              onPress={handleCallSupport}
            />
          </View>
        </Section>

        {/* FAQ Section */}
        <Section>
          <SectionTitle value="Frequently Asked Questions" />
          <View style={styles.card}>
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                title={item.question}
                content={item.answer}
                expanded={expandedFaq === index}
                onToggle={() => setExpandedFaq(expandedFaq === index ? null : index)}
              />
            ))}
          </View>
        </Section>

        {/* Resources Section */}
        <Section>
          <SectionTitle value="Resources" />
          <ActionRow title="User Guide" description="Learn how to use the app" leftIcon="book" />
          <ActionRow
            title="Video Tutorials"
            description="Watch step-by-step guides"
            leftIcon="video"
          />
          <ActionRow
            title="Report a Bug"
            description="Help us improve the app"
            leftIcon="bug"
            onPress={handleReportBug}
          />
        </Section>

        {/* App Info */}
        <Section>
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>App Version 1.0.0</Text>
            <Text style={styles.appCopyright}>© 2026 CoralKm </Text>
          </View>
        </Section>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
