import { Text, TouchableOpacity, View } from "react-native";
import { StepProps } from "../Step";
import { styles } from "./StepPanel.style";

/**
 * Step panel component for displaying step content with navigation controls
 */
export default function StepPanel({
  title,
  nextStep,
  children,
  isReady = false,
  onCancel,
  onNext,
}: StepProps) {
  // Render
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {children}
        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              styles.nextButton,
              !isReady && styles.disabledButton,
            ]}
            onPress={onNext}
            disabled={!isReady}
          >
            <Text style={styles.nextButtonText}>{nextStep}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
