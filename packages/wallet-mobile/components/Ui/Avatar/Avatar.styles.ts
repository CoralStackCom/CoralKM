import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'size-sm': {
    width: 32,
    height: 32,
  },
  'size-md': {
    width: 40,
    height: 40,
  },
  'size-lg': {
    width: 48,
    height: 48,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
})
