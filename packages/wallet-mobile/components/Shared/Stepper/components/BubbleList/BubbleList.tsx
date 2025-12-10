import { StyleSheet, View } from "react-native";
import { BubbleListProps } from "./BubbleList.interface";
import BubbleStep from "./BubbleStep";

/**
 * Bubble list component for displaying step progression
 */
export default function BubbleList({
  totalSteps,
  activeStep,
  labels,
}: BubbleListProps) {
  // Validate props
  const validTotalSteps = Math.max(0, totalSteps);
  const validActiveStep = Math.max(0, Math.min(activeStep, validTotalSteps));

  // Generate bubbles
  const bubbles = [];
  const initialTransitionDelay = 1;

  for (let i = 1; i <= validTotalSteps; i++) {
    const isComplete = i < validActiveStep;
    const isActive = i === validActiveStep;
    const transitionDelay = initialTransitionDelay + (i - 1) * 0.2;

    bubbles.push(
      <BubbleStep
        key={i}
        label={labels[i - 1] || ""}
        stepNumber={i}
        isActive={isActive}
        isComplete={isComplete}
        showDelay={transitionDelay}
      />
    );
  }

  // Render
  return <View style={styles.container}>{bubbles}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});
