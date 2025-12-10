import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { BackgroundProps, PhaseType } from "./Background.interface";
import { styles } from "./Background.style";
import { getCurrentPhase, getPhaseGradients } from "./Background.utils";
import { Aquarium } from "./effects/aquarium";

/**
 * Background component with animated scenes and time-based phases
 */
export default function Background({
  disableAnimations = false,
  view = "land",
  phase,
  updateFrequency = 15,
  onTransitionEnd,
}: BackgroundProps) {
  // Component State
  const [currentPhase, setCurrentPhase] = useState<PhaseType>("day");
  const gradients = getPhaseGradients(currentPhase);

  /**
   * Auto update phase if not provided
   */
  useEffect(() => {
    if (phase) {
      setCurrentPhase(phase);
    } else {
      const timer = setInterval(() => {
        setCurrentPhase(getCurrentPhase());
      }, 1000 * 60 * updateFrequency);
      return () => clearInterval(timer);
    }
  }, [phase, updateFrequency]);

  /**
   * Handle background transition completion
   */
  // const handleTransitionEnd = useCallback(() => {
  //   onTransitionEnd?.(view);
  // }, [onTransitionEnd, view]);

  // Render
  return (
    <View style={styles.container}>
      {/* === SKY VIEW === */}
      {view === "sky" && (
        <LinearGradient
          colors={gradients.sky as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject, styles.sky]}
        >
          {(currentPhase === "night" ||
            currentPhase === "morning" ||
            currentPhase === "evening") && (
            <Image
              source={require("@/assets/svg/stars.png")}
              style={[
                styles.stars,
                currentPhase === "night" ? { opacity: 1 } : { opacity: 0.3 },
              ]}
              resizeMode="cover"
            />
          )}
          <Image
            source={
              (currentPhase === "morning"
                ? require("@/assets/svg/sun--morning.png")
                : require("@/assets/svg/sun--day.png")) as ImageSourcePropType
            }
            style={[
              styles.sun,
              view === "sky"
                ? { transform: [{ translateY: 0 }] }
                : { transform: [{ translateY: 50 }] },
            ]}
            resizeMode="contain"
          />
        </LinearGradient>
      )}

      {/* === LAND VIEW === */}
      {view === "land" && (
        <View style={[StyleSheet.absoluteFillObject, styles.land]}>
          <LinearGradient
            colors={gradients.land as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Image
            source={require("@/assets/svg/mountains-left.png")}
            style={styles.mountainsLeft}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/svg/mountains-right.png")}
            style={styles.mountainsRight}
            resizeMode="contain"
          />
        </View>
      )}

      {/* === UNDERWATER VIEW === */}
      {view === "underwater" && (
        <View style={[StyleSheet.absoluteFillObject, styles.underwater]}>
          <LinearGradient
            colors={gradients.underwater as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFillObject, styles.underwater]}
          />
          <Aquarium />
        </View>
      )}
    </View>
  );
}
