import { StyleSheet } from 'react-native'
import { cardShadow, palette, radius, tint } from '@/constants/design'

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11,58,82,0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: palette.surface,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    ...cardShadow,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: palette.border,
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.heading,
    letterSpacing: -0.4,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: palette.textMuted,
    fontWeight: '700',
    lineHeight: 18,
  },

  /* Segmented control */
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 18,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: palette.surface,
    ...cardShadow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textMuted,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.navy,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSubtle,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: palette.heading,
  },
  errorText: {
    color: palette.coral,
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  button: {
    flex: 1,
    backgroundColor: palette.navy,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: tint(palette.navy),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonTextOutline: {
    color: palette.navy,
    fontSize: 15,
    fontWeight: '700',
  },
})
