import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { PlatformPressable } from '@react-navigation/elements'
import * as Haptics from 'expo-haptics'
import type React from 'react'

/**
 * HapticTab component.
 *
 * A custom bottom tab bar button that provides
 * light haptic feedback on iOS when pressed.
 *
 * Used to enhance tactile interaction in tab navigation.
 */
export const HapticTab: React.FC<BottomTabBarButtonProps> = props => {
  return (
    <PlatformPressable
      {...props}
      onPressIn={event => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on iOS tabs
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }

        props.onPressIn?.(event)
      }}
    />
  )
}
