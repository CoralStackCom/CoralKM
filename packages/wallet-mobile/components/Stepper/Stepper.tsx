import { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { StepperProps } from './Stepper.interface'
import { styles } from './Stepper.style'
import { BubbleList } from './components/BubbleList'

const { height } = Dimensions.get('window')

/**
 * Stepper component for multi-step forms with animated transitions
 */
export default function Stepper({
  children,
  activeStep,
  labels,
  open = true,
  onTransitionEnd,
}: StepperProps) {
  // Component State
  const [show, setShow] = useState(open)
  const opacity = useSharedValue(open ? 1 : 0)

  /**
   * Handle open/close animations
   */
  useEffect(() => {
    if (open) {
      setShow(true)
      opacity.value = withTiming(1, { duration: 500 })
    } else {
      opacity.value = withTiming(0, { duration: 500 }, finished => {
        if (finished) {
          runOnJS(setShow)(false)
          if (onTransitionEnd) {
            runOnJS(onTransitionEnd)()
          }
        }
      })
    }
  }, [open, opacity, onTransitionEnd])

  /**
   * Animated container style
   */
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  if (!show && !open) return null

  // Render
  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.scrollView}>
        <View style={styles.content}>
          {/* Horizontal Bubble List at Top */}
          <View style={styles.bubbleContainer}>
            <BubbleList labels={labels} totalSteps={children.length} activeStep={activeStep} />
          </View>

          {/* Step Content */}
          <View style={styles.stepContainer}>
            {children.map((child, index) => {
              const isActive = activeStep === index + 1
              const isPast = activeStep > index + 1

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.step,
                    {
                      opacity: isActive ? 1 : 0,
                      transform: [
                        {
                          translateY: isPast ? -height : 0,
                        },
                      ],
                      position: isActive ? 'relative' : 'absolute',
                      pointerEvents: isActive ? 'auto' : 'none',
                    },
                  ]}
                >
                  {child}
                </Animated.View>
              )
            })}
          </View>
        </View>
      </View>
    </Animated.View>
  )
}
