import { StyleSheet } from 'react-native'

const MAIN_COLOR = '#1B5678'

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 60,
    borderRadius: 30,
    backgroundColor: MAIN_COLOR,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: 'center',
  },
  tabButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    height: 30,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
})
