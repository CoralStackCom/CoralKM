import { StyleSheet } from 'react-native'
import { palette, radius } from '@/constants/design'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 12,
  },
  iconChip: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.heading,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: palette.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: palette.navy,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
})
