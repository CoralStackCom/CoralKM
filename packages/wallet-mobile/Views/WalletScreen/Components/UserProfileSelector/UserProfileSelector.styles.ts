import { StyleSheet } from 'react-native'
import { palette, radius, tint } from '@/constants/design'

export const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    backgroundColor: tint(palette.navy),
  },
  triggerName: { fontSize: 15, fontWeight: '700', color: palette.heading },
  modal: { flex: 1, backgroundColor: '#EAF2F6' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
    backgroundColor: palette.surface,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: palette.heading },
  modalClose: { fontSize: 15, fontWeight: '700', color: palette.navy },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
    backgroundColor: palette.surface,
  },
  itemName: { fontSize: 15, fontWeight: '600', color: palette.heading, flex: 1 },
})
