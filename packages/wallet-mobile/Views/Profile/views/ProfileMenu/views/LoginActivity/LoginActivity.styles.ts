import { StyleSheet } from 'react-native'
import { cardShadow, palette, radius, tint } from '@/constants/design'

export const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  intro: {
    fontSize: 13,
    color: palette.textMuted,
    marginBottom: 16,
    lineHeight: 19,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    ...cardShadow,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tint(palette.navy),
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: palette.heading },
  rowSubtitle: { fontSize: 13, color: palette.textMuted, marginTop: 2 },
  current: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.teal,
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: tint(palette.coral, '55'),
  },
  clearText: { color: palette.coral, fontSize: 14, fontWeight: '700' },
})
