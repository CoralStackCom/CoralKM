import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5678',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#7eadc9',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#1B5678',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderRadius: 8,
    maxWidth: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    fontFamily: 'monospace',
  },
})
