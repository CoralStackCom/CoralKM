import { Platform, StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // borderBottomWidth: StyleSheet.hairlineWidth,

    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        // shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: 'white',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },

  rightPlaceholder: {
    width: 40,
  },
})
