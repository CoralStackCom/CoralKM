import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
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

  icon: {
    color: '#444',
  },

  label: {
    fontSize: 16,
    color: 'white',
  },

  divider: {
    // height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5E5',
    marginLeft: 16,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: '#007AFF',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
})
