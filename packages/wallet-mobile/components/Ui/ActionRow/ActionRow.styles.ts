import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    overflow: 'hidden',
    borderRadius: 12,
  },
  resourceIcon: {
    fontSize: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  leftIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },

  text: {
    gap: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },

  description: {
    fontSize: 13,
    color: '#777',
  },

  right: {
    marginLeft: 12,
  },
})
