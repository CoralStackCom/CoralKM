import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  color: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selected: {
    borderWidth: 2,
    borderColor: '#000',
  },

  checkmark: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
})
