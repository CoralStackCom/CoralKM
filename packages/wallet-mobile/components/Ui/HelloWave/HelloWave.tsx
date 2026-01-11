import type React from 'react'
import Animated from 'react-native-reanimated'

/**
 * HelloWave component.
 *
 * Displays a waving hand emoji with a subtle
 * rotation animation for a friendly greeting effect.
 */
export const HelloWave: React.FC = () => {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}
    >
      👋
    </Animated.Text>
  )
}
