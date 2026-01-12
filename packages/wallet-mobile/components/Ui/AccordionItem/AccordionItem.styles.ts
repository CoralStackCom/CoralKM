import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    opacity: 0.85,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '400',
    color: '#666',
  },
  content: {
    paddingBottom: 14,
  },
  contentText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
})
