import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import type { StepProps } from './Step.interfaces'
import { styles } from './Step.styles'

/**
 * Step panel component.
 *
 * Displays a step panel with form content for the user to complete
 * before moving onto the next step of the setup workflow.
 */
export const Step: React.FC<StepProps> = ({
  title,
  nextStep,
  children,
  isReady = false,
  onCancel,
  onNext,
}) => {
  return (
    <View style={styles.stepPanelContainer}>
      <Text style={styles.header} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.childrenContainer}>{children}</View>
      <View style={styles.buttonContainer}>
        {onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onCancel?.()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, !isReady && styles.buttonDisabled]}
          onPress={onNext}
          disabled={!isReady}
        >
          <Text style={styles.buttonText}>{nextStep}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Step
