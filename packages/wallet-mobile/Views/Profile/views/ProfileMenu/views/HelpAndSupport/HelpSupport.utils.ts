import { Alert, Linking } from 'react-native'

// Sample FAQ items
export const faqItems = [
  {
    question: 'How do I reset my password?',
    answer:
      "Go to Settings > Privacy & Security > Change Password, or tap 'Forgot Password' on the login screen.",
  },
  {
    question: 'How do I add household members?',
    answer:
      "Navigate to your household settings and tap 'Invite Member'. They'll receive an email invitation.",
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! We use end-to-end encryption and your data is never shared with third parties.',
  },
  {
    question: 'How do I export my data?',
    answer:
      'Go to Privacy & Security > Download Your Data to request a full export of your information.',
  },
]
// Function to handle contacting support via email
export const handleContactSupport = () => {
  Linking.openURL('mailto:support@example.com?subject=Support%20Request')
}
//  Function to handle calling support
export const handleCallSupport = () => {
  Alert.alert('Call Support', 'Would you like to call our support team?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Call', onPress: () => Linking.openURL('tel:+1800555000') },
  ])
}

// Function to handle live chat support
export const handleLiveChat = () => {
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

// Function to handle reporting a bug via email
export const handleReportBug = () => {
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
