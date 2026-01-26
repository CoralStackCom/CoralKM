import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Important for measuring
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  formBottom: {
    marginTop: 24,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
})
