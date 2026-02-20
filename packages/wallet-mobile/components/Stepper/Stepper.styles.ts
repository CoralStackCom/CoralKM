import { Dimensions, StyleSheet } from 'react-native'

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    maxHeight: height,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: 'transparent',
  },
  bubbleContainer: {
    borderRadius: 12,
  },
  stepContainer: {
    position: 'relative',
    minHeight: 300,
  },
  step: {
    width: '100%',
  },
})
