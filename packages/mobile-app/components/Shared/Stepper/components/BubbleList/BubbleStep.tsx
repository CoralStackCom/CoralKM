import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BubbleStepProps } from "./BubbleStep.interface";

/**
 * Animated bubble step component for stepper progression
 */
export default function BubbleStep({
  label,
  stepNumber,
  isActive = false,
  isComplete = false,
  showDelay = 1.5,
}: BubbleStepProps) {
  // Component State
  const scale = useSharedValue(0);
  const animationScale = useSharedValue(1);
  const labelFontSize = useSharedValue(18);
  const numberOpacity = useSharedValue(1);
  const lottieRef = useRef<LottieView>(null);

  /**
   * Initial entrance animation - bubble pops in
   */
  useEffect(() => {
    scale.value = withDelay(showDelay * 1000, withSpring(1, { damping: 15 }));
  }, [showDelay, scale]);

  /**
   * Active state animation - scale up animation wrapper
   */
  useEffect(() => {
    if (isActive) {
      animationScale.value = withSpring(1.65, { damping: 12 });
      labelFontSize.value = withTiming(24, { duration: 300 });
    } else {
      animationScale.value = withSpring(1, { damping: 12 });
      labelFontSize.value = withTiming(18, { duration: 300 });
    }
  }, [isActive, animationScale, labelFontSize]);

  /**
   * Complete state animation - fade out number and play lottie
   */
  useEffect(() => {
    if (isComplete) {
      numberOpacity.value = withTiming(0, { duration: 300 });
      lottieRef.current?.play();
      playPopSound();
    } else {
      numberOpacity.value = withTiming(1, { duration: 300 });
      lottieRef.current?.reset();
    }
  }, [isComplete, numberOpacity]);

  /**
   * Play pop sound effect when step completes
   */
  const playPopSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/pop.mp3"),
        { shouldPlay: true }
      );
      await sound.playAsync();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Silently fail if sound doesn't exist
    }
  };

  /**
   * Container scale animation style
   */
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /**
   * Animation wrapper scale style
   */
  const animationWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animationScale.value }],
  }));

  /**
   * Label font size animation style
   */
  const labelStyle = useAnimatedStyle(() => ({
    fontSize: labelFontSize.value,
  }));

  /**
   * Number opacity animation style
   */
  const numberStyle = useAnimatedStyle(() => ({
    opacity: numberOpacity.value,
  }));

  // Render
  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.animationWrapper, animationWrapperStyle]}>
        <LottieView
          ref={lottieRef}
          source={require("@/assets/animations/bubble-pop.json")}
          style={styles.lottie}
          loop={false}
          autoPlay={false}
        />
        <Animated.Text style={[styles.number, numberStyle]}>
          {stepNumber}
        </Animated.Text>
      </Animated.View>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 4,
  },
  animationWrapper: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  lottie: {
    width: 64,
    height: 64,
    position: "absolute",
  },
  number: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
