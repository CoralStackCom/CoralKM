import React from 'react'
import { View } from 'react-native'

import { BubbleListProps } from './BubbleList.interfaces'
import { styles } from './BubbleList.styles'
import { BubbleStep } from './BubbleStep'

/**
 * Bubble list component for displaying step progression.
 *
 * Renders a horizontal row of animated bubble steps showing
 * the current progress through a multi-step flow.
 */
export const BubbleList: React.FC<BubbleListProps> = ({
  totalSteps,
  activeStep,
  labels,
}) => {
  const validTotalSteps = Math.max(0, totalSteps)
  const validActiveStep = Math.max(0, Math.min(activeStep, validTotalSteps))

  const initialTransitionDelay = 1

  const bubbles = Array.from({ length: validTotalSteps }, (_, i) => {
    const stepNum = i + 1
    return (
      <BubbleStep
        key={stepNum}
        label={labels[i] || ''}
        stepNumber={stepNum}
        isActive={stepNum === validActiveStep}
        isComplete={stepNum < validActiveStep}
        showDelay={initialTransitionDelay + i * 0.2}
      />
    )
  })

  return <View style={styles.container}>{bubbles}</View>
}
