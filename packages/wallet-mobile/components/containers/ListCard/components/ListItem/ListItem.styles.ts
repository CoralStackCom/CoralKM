import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'flex-start',
  },

  left: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },

  right: {
    marginLeft: 12,
  },
})
