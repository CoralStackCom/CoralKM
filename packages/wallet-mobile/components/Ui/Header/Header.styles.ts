import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  side: {
    width: 40, // keeps title centered
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 4,
    color: '#b0c2ccff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b0c2ccff',
  },
})
