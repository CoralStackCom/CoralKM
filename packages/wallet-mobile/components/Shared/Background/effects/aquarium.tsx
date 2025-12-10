import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

/**
 * Fish type definition
 */
type FishType = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  direction: "left" | "right";
  speed: number;
  targetX: number;
  targetY: number;
  progress: number;
  delay: number;
};

/**
 * Component Properties
 */
type AquariumProps = {
  /**
   * Number of fish to display in the aquarium
   */
  fishCount?: number;
  /**
   * Base speed multiplier for fish movement
   */
  speed?: number;
  /**
   * Array of fish colors
   */
  colors?: string[];
};

/**
 * Animated aquarium component with swimming fish
 */
export const Aquarium: React.FC<AquariumProps> = ({
  fishCount = 10,
  speed = 0.5,
  colors = ["#1B5678"],
}) => {
  // Component State
  const [fishes, setFishes] = useState<FishType[]>([]);
  const { width, height } = Dimensions.get("window");
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Fish SVG path data
   */
  const fishPath =
    "M43.7-3.8l-65.3-45.4c-0.8-0.5-1.6-0.8-2.4-0.8c-2.5-0.1-4.8,1.8-4.8,4.6v40.8l-14.5-10.1c-0.9-0.6-2.2,0-2.2,1.1V0v13.7c0,1.1,1.3,1.8,2.2,1.1l14.5-10.1v40.6c0,2.8,2.4,4.7,4.8,4.6c0.8,0,1.7-0.3,2.4-0.8L43.7,3.8c1.3-0.9,2-2.4,2-3.8C45.6-1.4,45-2.9,43.7-3.8z";

  /**
   * Create a new fish with random properties
   */
  const createFish = (id: number): FishType => ({
    id,
    x: Math.random() * width,
    y: Math.random() * height,
    size: 30 + Math.random() * 40,
    color: colors[Math.floor(Math.random() * colors.length)],
    direction: Math.random() > 0.5 ? "left" : "right",
    speed: 0.5 + Math.random() * speed,
    targetX: Math.random() * width,
    targetY: 0,
    progress: 0,
    delay: Math.random() * 100,
  });

  /**
   * Update fish positions and animations
   */
  const updateFishes = () => {
    setFishes((prevFishes) =>
      prevFishes.map((fish) => {
        if (fish.delay > 0) {
          return { ...fish, delay: fish.delay - 1 };
        }

        let progress = fish.progress + 0.01;
        let newX = fish.x;
        let newDirection = fish.direction;

        if (progress >= 1) {
          newDirection = Math.random() > 0.5 ? "left" : "right";
          progress = 0;

          return {
            ...fish,
            targetX: Math.random() * width,
            targetY: 0,
            direction: newDirection,
            progress,
            x: newX,
          };
        }

        // Horizontal movement only
        if (fish.direction === "right") {
          newX = fish.x + fish.speed;
          if (newX > width) {
            newDirection = "left";
            newX = width - 1;
          }
        } else {
          newX = fish.x - fish.speed;
          if (newX < 0) {
            newDirection = "right";
            newX = 1;
          }
        }

        return {
          ...fish,
          x: newX,
          progress,
          direction: newDirection,
        };
      })
    );
  };

  /**
   * Initialize fishes and start animation
   */
  useEffect(() => {
    const initialFishes = Array.from({ length: fishCount }, (_, i) =>
      createFish(i)
    );
    setFishes(initialFishes);

    animationRef.current = setInterval(updateFishes, 16);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [fishCount, speed, colors]);

  // Render
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {fishes.map((fish) => (
          <G
            key={fish.id}
            x={fish.x}
            y={fish.y}
            scale={fish.size / 100}
            rotation={fish.direction === "right" ? 0 : 180}
          >
            <Path d={fishPath} fill={fish.color} />
          </G>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Aquarium;
