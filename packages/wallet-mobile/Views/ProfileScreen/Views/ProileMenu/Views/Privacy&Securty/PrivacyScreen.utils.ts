import { Alert } from 'react-native'

export const handleChangePassword = () => {
  Alert.alert('Change Password', 'You will receive an email to reset your password.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Send Email',
      onPress: () => Alert.alert('Email Sent', 'Check your inbox for password reset instructions.'),
    },
  ])
}

export const handleViewLoginActivity = () => {
  Alert.alert(
    'Login Activity',
    'Recent logins:\n\n• iPhone 14 Pro - San Francisco, CA\n  Today at 10:30 AM\n\n• MacBook Pro - San Francisco, CA\n  Yesterday at 3:45 PM\n\n• iPad Air - San Francisco, CA\n  2 days ago'
  )
}

export const handleDownloadData = () => {
  Alert.alert(
    'Download Your Data',
    "We'll prepare a file with all your data. This may take up to 48 hours.",
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Request Data',
        onPress: () =>
          Alert.alert('Request Submitted', "You'll receive an email when your data is ready."),
      },
    ]
  )
}

export const handleDeleteAccount = () => {
  Alert.alert(
    'Delete Account',
    'This action cannot be undone. All your data will be permanently deleted.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete Account',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Account Scheduled for Deletion',
            'Your account will be deleted in 30 days. Log in again to cancel.'
          ),
      },
    ]
  )
}
