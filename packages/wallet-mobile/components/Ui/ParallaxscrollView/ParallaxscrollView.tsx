import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated'

import { ThemedView } from '@/components/Ui/ThemedView/themed-view'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ParallaxScrollViewProps } from './ParallaxscrollView.interfaces'
import { styles } from './ParallaxscrollView.styles'

const HEADER_HEIGHT = 250

/**
 * ParallaxScrollView component.
 *
 * Provides a scroll view with a parallax animated header that:
 * - Translates vertically on scroll
 * - Scales when pulled down
 * - Adapts background color based on theme
 */
export const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
  children,
  headerImage,
  headerBackgroundColor,
}) => {
  const backgroundColor = useThemeColor({}, 'background')
  const colorScheme = useColorScheme() ?? 'light'

  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollOffset(scrollRef)

  /**
   * Animated header style based on scroll offset
   */
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
      },
    ],
  }))

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}
    >
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}
      >
        {headerImage}
      </Animated.View>

      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  )
}
