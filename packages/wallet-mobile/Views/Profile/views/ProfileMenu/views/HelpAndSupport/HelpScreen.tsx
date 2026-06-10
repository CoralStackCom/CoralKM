import Section from '@/components/containers/Section'
import SectionTitle from '@/components/containers/Section/components/SectionTitle'
import { AccordionItem } from '@/components/ui/AccordionItem/AccordionItem'
import ActionRow from '@/components/ui/ActionRow'
import { QuickActionButton } from '@/components/ui/Buttons/QuickActionButton'
import Header from '@/components/ui/Header'
import { SearchInput } from '@/components/ui/SearchInput'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { styles } from './HelpSupport.styles'
import {
  faqItems,
  handleCallSupport,
  handleContactSupport,
  handleLiveChat,
  handleReportBug,
} from './HelpSupport.utils'

/**
 *  Help & Support Screen Component
 *
 */

export const HelpSupportScreen: React.FC = () => {
  // Component State
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
                showDivider={index < faqItems.length - 1}
              />
            ))}
          </View>
        </Section>

        {/* Resources Section */}
        <Section>
          <SectionTitle value="Resources" />
          <View style={styles.card}>
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
          </View>
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
export default HelpSupportScreen
