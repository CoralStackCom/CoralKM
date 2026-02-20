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
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import type { LightRayData } from '../Background.interfaces'
import { randomNumber } from '../Background.utils'

const AnimatedPath = Animated.createAnimatedComponent(Path)

interface WaterLightRaysProps {
  totalRays?: number
  alphaTop?: number
  alphaBottom?: number
}

function LightRay({ ray, alphaTop }: { ray: LightRayData; alphaTop: number; alphaBottom: number }) {
  const progress = useSharedValue(0)
  const opacity = useSharedValue(0)

  const { width, height } = useMemo(() => Dimensions.get('window'), [])

  const rayConstants = useMemo(() => {
    const positionDiff = ray.endPosition - ray.startPosition
    const sizeDiff = ray.endSize - ray.startSize
    const halfHeight = height / 2
    const widthRatio = width / 100

    return {
      positionDiff,
      sizeDiff,
      halfHeight,
      widthRatio,
    }
  }, [ray, width, height])

  useEffect(() => {
    const duration = Math.max(ray.duration, 8000)

    progress.value = withDelay(
      ray.delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false)
    )

    opacity.value = withDelay(
      ray.delay,
      withRepeat(
        withSequence(
          withTiming(alphaTop * 0.7, { duration: duration / 2, easing: Easing.ease }), // Reduced opacity for less visual weight
          withTiming(0, { duration: duration / 2, easing: Easing.ease })
        ),
        -1,
        false
      )
    )

    return () => {
      cancelAnimation(progress)
      cancelAnimation(opacity)
    }
  }, [ray.delay, alphaTop])

  const animatedProps = useAnimatedProps(() => {
    'worklet'
    const { positionDiff, sizeDiff, halfHeight, widthRatio } = rayConstants
    const prog = progress.value

    const startPos = (ray.startPosition + positionDiff * prog) * widthRatio
    const currentSize = (ray.startSize + sizeDiff * prog) * widthRatio

    const x1 = startPos - halfHeight
    const x2 = startPos + currentSize - halfHeight
    const x3 = startPos + currentSize + halfHeight
    const x4 = startPos + halfHeight

    return {
      d: `M ${x1} 0 L ${x2} 0 L ${x3} ${height} L ${x4} ${height} Z`,
      opacity: opacity.value,
    }
  })

  return <AnimatedPath animatedProps={animatedProps} fill={`url(#gradient-${ray.id})`} />
}

export function WaterLightRays({
  totalRays = 3, // Reduced from 6 to 3 for better performance
  alphaTop = 0.25, // Reduced opacity for subtlety
  alphaBottom = 0,
}: WaterLightRaysProps) {
  const { width, height } = useMemo(() => Dimensions.get('window'), [])

  const rays = useMemo<LightRayData[]>(() => {
    return Array.from({ length: totalRays }, (_, i) => {
      const startPosition = randomNumber(-20, 90)
      const distance = randomNumber(5, 50)
      return {
        id: i,
        startSize: randomNumber(4, 10), // Slightly larger for fewer rays
        endSize: randomNumber(4, 10),
        startPosition,
        endPosition: startPosition + distance,
        duration: randomNumber(8000, 18000), // Slower animations
        delay: randomNumber(0, 6000),
      }
    })
  }, [totalRays])

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          {rays.map(ray => (
            <LinearGradient
              key={`grad-${ray.id}`}
              id={`gradient-${ray.id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="white" stopOpacity={alphaTop} />
              <Stop offset="100%" stopColor="white" stopOpacity={alphaBottom} />
            </LinearGradient>
          ))}
        </Defs>
        {rays.map(ray => (
          <LightRay key={ray.id} ray={ray} alphaTop={alphaTop} alphaBottom={alphaBottom} />
        ))}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
})
