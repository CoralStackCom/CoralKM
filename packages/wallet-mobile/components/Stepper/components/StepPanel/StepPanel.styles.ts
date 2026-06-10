import { StyleSheet } from 'react-native'
import { cardShadow, palette, radius } from '@/constants/design'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: 22,
    ...cardShadow,
  },
  content: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.heading,
    letterSpacing: -0.4,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.border,
    marginRight: 16,
    minWidth: 150,
  },
  cancelButtonText: {
    color: palette.textSubtle,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: palette.navy,
    flex: 1,
    maxWidth: 300,
  },
  disabledButton: {
    backgroundColor: palette.textMuted,
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
