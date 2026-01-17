import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  userDidSection: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  userDidText: {
    fontSize: 12,
    color: '#444',
  },
  actionsRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  pingButton: {
    backgroundColor: '#007AFF',
  },
  guardianButton: {
    backgroundColor: '#34C759',
  },
  revokeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  guardianText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  revokeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
})
