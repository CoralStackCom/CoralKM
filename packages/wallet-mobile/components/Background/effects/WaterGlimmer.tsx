import { useEffect, useMemo } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import type { GlimmerData } from '../Background.interface'
import { randomNumber } from '../Background.utils'

const AnimatedPath = Animated.createAnimatedComponent(Path)

interface WaterGlimmerProps {
  totalGlimmers?: number
  alphaTop?: number
  alphaBottom?: number
}

function GlimmerParticle({
  glimmer,
  width,
  height,
}: {
  glimmer: GlimmerData
  width: number
  height: number
}) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    const duration = Math.max(glimmer.duration, 3000)

    opacity.value = withDelay(
      glimmer.delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: duration / 2, easing: Easing.ease }), // Reduced max opacity
          withTiming(0, { duration: duration / 2, easing: Easing.ease })
        ),
        -1,
        false
      )
    )

    return () => {
      cancelAnimation(opacity)
    }
  }, [glimmer.delay])

  const pathData = useMemo(() => {
    const x = (glimmer.x / 100) * width
    const y = (glimmer.y / 100) * (height * 0.75)
    const size = glimmer.size

    return {
      d: `M ${x} ${y - size} L ${x + size} ${y} L ${x} ${y + size} L ${x - size} ${y} Z`,
    }
  }, [glimmer, width, height])

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }))

  return <AnimatedPath d={pathData.d} fill="white" animatedProps={animatedProps} />
}

export function WaterGlimmer({
  totalGlimmers = 8, // Reduced from 15 to 8 for better performance
  alphaTop = 0.6,
  alphaBottom = 0.1,
}: WaterGlimmerProps) {
  const { width, height } = useMemo(() => Dimensions.get('window'), [])

  const glimmers = useMemo<GlimmerData[]>(() => {
    return Array.from({ length: totalGlimmers }, (_, i) => ({
      id: i,
      size: randomNumber(6, 12), // Slightly larger for fewer particles
      x: randomNumber(0, 100),
      y: randomNumber(0, 100),
      duration: randomNumber(3000, 5000), // Slower animations
      delay: randomNumber(0, 4000),
    }))
  }, [totalGlimmers])

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height * 0.75} style={StyleSheet.absoluteFill}>
        {glimmers.map(glimmer => (
          <GlimmerParticle key={glimmer.id} glimmer={glimmer} width={width} height={height} />
        ))}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '75%',
    overflow: 'hidden',
  },
})
