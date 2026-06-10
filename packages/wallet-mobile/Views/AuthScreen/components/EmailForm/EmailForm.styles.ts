import { StyleSheet } from 'react-native'
import { cardShadow, palette, radius } from '@/constants/design'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: radius.xl,
    padding: 24,
    ...cardShadow,
  },
  logoBox: { alignItems: 'center', marginBottom: 18 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.heading,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 14,
    color: palette.textSubtle,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  error: { color: palette.coral, textAlign: 'center', marginBottom: 12, fontWeight: '500' },
  input: {
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: palette.heading,
    marginBottom: 16,
  },
  button: {
    backgroundColor: palette.navy,
    paddingVertical: 15,
    borderRadius: 999,
    alignItems: 'center',
  },
  disabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
