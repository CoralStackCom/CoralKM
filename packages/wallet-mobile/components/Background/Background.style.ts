import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  stars: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  sun: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: 50,
    right: 50,
  },
  waterArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  mountainsLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: '40%',
  },
  mountainsRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: '40%',
  },
})
