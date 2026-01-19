import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 78,
    paddingTop: 16,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    marginRight: 6,
  },
  guardianButton: {
    backgroundColor: '#22c55e',
  },
  guardianButtonText: {
    color: '#000000',
  },
  revokeButton: {
    backgroundColor: '#ef4444',
  },
})
