import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

/**
 * Glimmer type definition
 */
type GlimmerType = {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  time: number;
  alpha: number;
};

/**
 * Component Properties
 */
type WaterGlimmerProps = {
  /**
   * Total number of glimmers to display
   */
  totalGlimmers?: number;
  /**
   * Maximum opacity value for glimmers at top
   */
  alphaTop?: number;
  /**
   * Minimum opacity value for glimmers at bottom
   */
  alphaBottom?: number;
  /**
   * Percentage of screen height to cover with glimmers
   */
  heightPercentage?: number;
};

/**
 * Animated water glimmer effect component
 */
export const WaterGlimmer: React.FC<WaterGlimmerProps> = ({
  totalGlimmers = 50,
  alphaTop = 0.6,
  alphaBottom = 0.1,
  heightPercentage = 75,
}) => {
  // Component State
  const [glimmers, setGlimmers] = useState<GlimmerType[]>([]);
  const { width, height } = Dimensions.get("window");
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const glimmerHeight = (height * heightPercentage) / 100;

  /**
   * Generate random number between min and max
   */
  const randomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  /**
   * Create a new glimmer with random properties
   */
  const createGlimmer = (id: number, initial: boolean = false): GlimmerType => {
    const duration = randomNumber(100, 150);
    const y = randomNumber(0, glimmerHeight);
    return {
      id,
      size: randomNumber(5, 10),
      x: randomNumber(0, width),
      y,
      duration,
      time: initial ? randomNumber(0, duration) : 0,
      alpha: 0,
    };
  };

  /**
   * Update glimmer positions and animations
   */
  const updateGlimmers = () => {
    setGlimmers((prevGlimmers) => {
      let updatedGlimmers = [...prevGlimmers];

      // Add new glimmers if needed
      while (updatedGlimmers.length < totalGlimmers) {
        updatedGlimmers.push(createGlimmer(Date.now() + Math.random()));
      }

      // Update current glimmers
      updatedGlimmers = updatedGlimmers.map((glimmer) => {
        let alpha = 0;
        if (glimmer.time < glimmer.duration / 2) {
          alpha = glimmer.time / (glimmer.duration / 2);
        } else {
          alpha =
            1 - (glimmer.time - glimmer.duration / 2) / (glimmer.duration / 2);
        }

        return {
          ...glimmer,
          time: glimmer.time + 1,
          alpha: alpha * alphaTop, // Apply top alpha value
        };
      });

      // Remove glimmers that have completed their cycle
      return updatedGlimmers.filter(
        (glimmer) => glimmer.time <= glimmer.duration
      );
    });
  };

  /**
   * Initialize glimmers and start animation
   */
  useEffect(() => {
    // Create initial glimmers
    const initialGlimmers = Array.from({ length: totalGlimmers }, (_, i) =>
      createGlimmer(i, true)
    );
    setGlimmers(initialGlimmers);

    // Start animation
    animationRef.current = setInterval(updateGlimmers, 16); // ~60fps

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [totalGlimmers, alphaTop, alphaBottom, heightPercentage]);

  /**
   * Create diamond-shaped glimmer path
   */
  const createGlimmerPath = (size: number) => {
    const halfSize = size / 2;
    return `M0,-${halfSize} L${halfSize},0 L0,${halfSize} L-${halfSize},0 Z`;
  };

  // Render
  return (
    <View style={[styles.container, { height: glimmerHeight }]}>
      <Svg width={width} height={glimmerHeight}>
        {glimmers.map((glimmer) => {
          const actualSize = (glimmer.alpha * glimmer.size) / 2;

          return (
            <G key={glimmer.id} x={glimmer.x} y={glimmer.y}>
              <Path
                d={createGlimmerPath(actualSize)}
                fill="white"
                opacity={glimmer.alpha}
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default WaterGlimmer;
