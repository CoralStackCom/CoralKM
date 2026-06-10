import { Platform, type ViewStyle } from 'react-native'

/**
 * Shared design tokens for the unified app design system.
 *
 * Use these everywhere instead of hardcoded hex values so all screens
 * (Profile, Wallet, Chat, Info, …) read as one coherent system on top of the
 * underwater `Background`.
 */

/** Core color palette. */
export const palette = {
  /** Primary brand navy (buttons, key accents). */
  navy: '#1B5678',
  /** Darker navy for headings/titles. */
  heading: '#13415C',
  /** Accent colors used for icon chips and status. */
  blue: '#2B86B8',
  teal: '#2BB3A3',
  amber: '#F2A93B',
  purple: '#6C5CE7',
  coral: '#E0533D',
  success: '#22C55E',
  danger: '#E0533D',
  /** Text tones. */
  text: '#13415C',
  textMuted: '#8194A1',
  textSubtle: '#6B7280',
  /** Surfaces & lines. */
  surface: '#FFFFFF',
  surfaceMuted: '#F7FAFB',
  border: '#EEF2F5',
  /** Accent used on dark/camera surfaces. */
  accentLight: '#7EADC9',
} as const

/** Corner radius scale. */
export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
} as const

/** Standard spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const

/** Soft elevation used by cards across the app. */
export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#0B3A52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
}) as ViewStyle

/**
 * Build a translucent tint of a hex color (e.g. for icon chip backgrounds).
 *
 * @param hex   A 6-digit hex color.
 * @param alpha Two-digit hex alpha (default `1A` ≈ 10%).
 */
export const tint = (hex: string, alpha = '1A'): string => `${hex}${alpha}`
