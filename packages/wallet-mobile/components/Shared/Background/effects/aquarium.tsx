import { useEffect, useMemo } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import type { FishData } from '../Background.interface'
import { hslToHex, randomNumber } from '../Background.utils'

const FISH_PATH =
  'M43.7-3.8l-65.3-45.4c-0.8-0.5-1.6-0.8-2.4-0.8c-2.5-0.1-4.8,1.8-4.8,4.6v40.8l-14.5-10.1c-0.9-0.6-2.2,0-2.2,1.1V0v13.7c0,1.1,1.3,1.8,2.2,1.1l14.5-10.1v40.6c0,2.8,2.4,4.7,4.8,4.6c0.8,0,1.7-0.3,2.4-0.8L43.7,3.8c1.3-0.9,2-2.4,2-3.8C45.6-1.4,45-2.9,43.7-3.8z'

interface AquariumProps {
  fishGroupCount?: number
  fishGroupMax?: number
  fishSize?: [number, number]
  fishHue?: [number, number]
  fishSat?: [number, number]
  fishLightness?: [number, number]
}

function Fish({ fish }: { fish: FishData }) {
  const translateX = useSharedValue(fish.startX)
  const translateY = useSharedValue(fish.startY)

  useEffect(() => {
    const duration = Math.max(fish.duration, 10000)

    translateX.value = withDelay(
      fish.delay,
      withRepeat(
        withSequence(
          withTiming(fish.endX, {
            duration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(fish.startX, {
            duration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    )

    translateY.value = withDelay(
      fish.delay,
      withRepeat(
        withSequence(
          withTiming(fish.endY, {
            duration: duration * 0.7,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(fish.startY, {
            duration: duration * 0.7,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    )

    return () => {
      cancelAnimation(translateX)
      cancelAnimation(translateY)
    }
  }, [fish, translateX, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: fish.direction === 'left' ? 1 : -1 },
      { scale: fish.size / 100 },
    ],
  }))

  const fishWidth = 100
  const fishHeight = 120

  return (
    <Animated.View style={[styles.fish, animatedStyle]}>
      <Svg width={fishWidth} height={fishHeight} viewBox="-50 -60 100 120">
        <Path d={FISH_PATH} fill={fish.color} />
      </Svg>
    </Animated.View>
  )
}

export function Aquarium({
  fishGroupCount = 1, // Reduced from 2 to 1 group
  fishGroupMax = 2,
  fishSize = [60, 90], // Slightly larger for fewer fish
  fishHue = [201, 203],
  fishSat = [63, 63],
  fishLightness = [30, 60],
}: AquariumProps) {
  const { width, height } = useMemo(() => Dimensions.get('window'), [])

  const fishes = useMemo<FishData[]>(() => {
    const allFish: FishData[] = []
    let id = 0

    for (let g = 0; g < fishGroupCount; g++) {
      const groupSize = randomNumber(1, fishGroupMax, true)
      const direction = Math.random() > 0.5 ? 'left' : 'right'
      const baseX = randomNumber(0, width)
      const baseY = randomNumber(height * 0.2, height * 0.8)

      for (let f = 0; f < groupSize; f++) {
        const color = hslToHex(
          randomNumber(fishHue[0], fishHue[1]),
          randomNumber(fishSat[0], fishSat[1]),
          randomNumber(fishLightness[0], fishLightness[1])
        )

        allFish.push({
          id: id++,
          size: randomNumber(fishSize[0], fishSize[1]),
          color,
          startX: baseX + randomNumber(-50, 50),
          startY: baseY + randomNumber(-30, 30),
          endX: baseX + randomNumber(200, 400) * (direction === 'left' ? 1 : -1),
          endY: baseY + randomNumber(-50, 50),
          duration: randomNumber(10000, 18000), // Slower animations
          delay: randomNumber(0, 4000),
          direction,
        })
      }
    }

    return allFish
  }, [fishGroupCount, fishGroupMax, fishSize, fishHue, fishSat, fishLightness, width, height])

  return (
    <View style={styles.container} pointerEvents="none">
      {fishes.map(fish => (
        <Fish key={fish.id} fish={fish} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  fish: {
    position: 'absolute',
    width: 100,
    height: 120,
  },
})
