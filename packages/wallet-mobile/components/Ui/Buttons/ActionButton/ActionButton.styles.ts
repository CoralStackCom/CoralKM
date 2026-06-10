import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textDisabled: {
    color: '#EEEEEE',
  },
})
export default styles
