import { palette, tint } from '@/constants/design'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol, type IconSymbolName } from '../icon-symbol'
import type { StateViewProps } from './StateView.interfaces'
import { styles } from './StateView.styles'

/** Default icon per non-loading variant. */
const DEFAULT_ICON: Record<'empty' | 'error', IconSymbolName> = {
  empty: 'inbox.fill',
  error: 'exclamationmark.triangle',
}

/**
 * StateView
 *
 * A reusable full-area indicator for loading, empty, and error states so every
 * screen shows these states consistently. Renders a spinner for `loading`, or a
 * tinted icon chip with a title, optional message, and optional action button.
 */
export const StateView: React.FC<StateViewProps> = ({
  variant,
  title,
  message,
  icon,
  actionLabel,
  onAction,
  color,
}) => {
  const accent = color ?? (variant === 'error' ? palette.coral : palette.navy)

  return (
    <View style={styles.container}>
      {variant === 'loading' ? (
        <ActivityIndicator size="large" color={accent} />
      ) : (
        <View style={[styles.iconChip, { backgroundColor: tint(accent) }]}>
          <IconSymbol name={icon ?? DEFAULT_ICON[variant]} size={34} color={accent} />
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}

      {!!actionLabel && !!onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default StateView
