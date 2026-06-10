import { StyleSheet } from 'react-native'
import { cardShadow, palette, radius } from '@/constants/design'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: radius.xl,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    ...cardShadow,
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
    fontWeight: '700',
    color: palette.heading,
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    color: palette.coral,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  formBottom: {
    marginTop: 24,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: palette.textSubtle,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 14,
    color: palette.navy,
    fontWeight: '700',
  },
})
