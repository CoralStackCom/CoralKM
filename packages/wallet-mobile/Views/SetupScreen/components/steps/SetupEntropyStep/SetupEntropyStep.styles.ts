import { Platform, StyleSheet } from 'react-native'
import { palette, radius, tint } from '@/constants/design'

export const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  description: {
    fontSize: 14,
    color: palette.textSubtle,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  canvasContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  canvasBox: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: tint(palette.accentLight, '66'),
    backgroundColor: '#04141D',
    ...Platform.select({
      ios: {
        shadowColor: palette.accentLight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  canvasOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  canvasOverlayText: {
    color: palette.accentLight,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  /* Strength meter */
  strengthSection: {
    width: '100%',
    marginBottom: 18,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSubtle,
  },
  strengthValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  strengthTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.border,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999,
  },

  /* Seed */
  seedSection: {
    width: '100%',
    marginBottom: 16,
  },
  seedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seedLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.heading,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: tint(palette.navy),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  copyButtonText: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  seedBox: {
    backgroundColor: '#0F172A',
    borderRadius: radius.md,
    padding: 14,
    minHeight: 62,
    justifyContent: 'center',
  },
  seedText: {
    fontSize: 11,
    color: '#9FE7FF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 16,
  },
  seedSubtext: {
    fontSize: 11,
    color: palette.textMuted,
    marginTop: 6,
  },

  /* Reset */
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: tint(palette.coral, '55'),
    minWidth: 160,
  },
  resetButtonDisabled: {
    borderColor: palette.border,
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
})
