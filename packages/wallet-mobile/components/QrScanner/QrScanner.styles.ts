import { Dimensions, StyleSheet } from 'react-native'
import { palette, radius } from '@/constants/design'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SCAN_FRAME_SIZE = Math.min(SCREEN_WIDTH * 0.72, 300)
const CORNER_SIZE = 32
const CORNER_THICKNESS = 4
const CORNER_RADIUS = 14

/** Scrim color around the scan cutout. */
const SCRIM = 'rgba(8, 28, 40, 0.62)'

export const SCAN_FRAME_DIMENSIONS = {
  size: SCAN_FRAME_SIZE,
  cornerSize: CORNER_SIZE,
  cornerThickness: CORNER_THICKNESS,
  cornerRadius: CORNER_RADIUS,
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04141D',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },

  /* Permission / loading states */
  stateContainer: {
    flex: 1,
    backgroundColor: '#04141D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  message: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },

  /* Top header overlay */
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  /* Cutout mask: dims everything except the centered scan window */
  maskRow: {
    flexDirection: 'row',
  },
  maskTop: {
    flex: 1,
    backgroundColor: SCRIM,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  maskBottom: {
    flex: 1,
    backgroundColor: SCRIM,
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  maskSide: {
    width: (SCREEN_WIDTH - SCAN_FRAME_SIZE) / 2,
    height: SCAN_FRAME_SIZE,
    backgroundColor: SCRIM,
  },

  /* Scan window */
  scanFrameWrapper: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    position: 'relative',
  },
  cornerBase: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: palette.accentLight,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: CORNER_RADIUS,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: CORNER_RADIUS,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: CORNER_RADIUS,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: CORNER_RADIUS,
  },
  scanLine: {
    position: 'absolute',
    left: CORNER_THICKNESS + 6,
    right: CORNER_THICKNESS + 6,
    height: 2,
    backgroundColor: palette.accentLight,
    borderRadius: 1,
    shadowColor: palette.accentLight,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  /* Instruction pill */
  instructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  /* Error pill */
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 83, 61, 0.2)',
    borderWidth: 1,
    borderColor: palette.coral,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: 16,
    gap: 8,
    maxWidth: '90%',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },

  /* Bottom controls */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 36,
    marginTop: 28,
  },
  control: {
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: palette.navy,
  },
  controlLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Buttons on permission-denied state */
  cancelButton: {
    marginTop: 20,
    paddingVertical: 13,
    paddingHorizontal: 28,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.md,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
