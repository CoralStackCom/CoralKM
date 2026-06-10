import { StyleSheet } from 'react-native'
import { palette, radius } from '@/constants/design'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 16,
    paddingBottom: 78,
    paddingTop: 16,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.navy,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radius.md,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    marginRight: 6,
  },
  guardianButton: {
    backgroundColor: palette.teal,
  },
  guardianButtonText: {
    color: '#ffffff',
  },
  revokeButton: {
    backgroundColor: palette.coral,
  },
})
