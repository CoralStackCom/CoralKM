import { StyleSheet } from 'react-native'
import { cardShadow, palette, radius, tint } from '@/constants/design'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  header: {
    paddingTop: 4,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.heading,
    letterSpacing: -0.4,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: palette.navy,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },

  channelItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    ...cardShadow,
  },

  channelItemSelected: {
    backgroundColor: tint(palette.navy, '14'),
  },

  channelInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touchableName: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  nameText: {
    fontWeight: '700',
    fontSize: 15,
    color: palette.heading,
    flexShrink: 1,
  },

  msgCount: {
    fontSize: 12,
    color: palette.textMuted,
    paddingLeft: 4,
    paddingRight: 8,
  },

  copyButton: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: tint(palette.navy),
    alignItems: 'center',
    justifyContent: 'center',
  },

  didRow: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
  },

  didText: {
    fontSize: 12,
    color: palette.textMuted,
    flex: 1,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.heading,
  },
  emptyText: {
    fontSize: 14,
    color: palette.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
})
