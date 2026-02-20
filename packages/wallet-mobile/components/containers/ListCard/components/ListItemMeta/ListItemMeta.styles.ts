import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 2,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },

  subtitle: {
    fontSize: 13,
    color: '#666',
  },

  caption: {
    fontSize: 12,
    color: '#999',
  },
})
