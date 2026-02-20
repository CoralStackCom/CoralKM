import type React from 'react'
import Animated from 'react-native-reanimated'

import { styles } from './HelloWave.styles'

/**
 * HelloWave component.
 *
 * Displays a waving hand emoji with a subtle
 * rotation animation for a friendly greeting effect.
 */
export const HelloWave: React.FC = () => {
  return (
    <Animated.Text
      style={[
        styles.wave,
        {
          animationName: {
            '50%': { transform: [{ rotate: '25deg' }] },
          },
          animationIterationCount: 4,
          animationDuration: '300ms',
        },
      ]}
    >
      👋
    </Animated.Text>
  )
}
