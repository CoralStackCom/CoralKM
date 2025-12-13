import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";

/**
 * Light ray type definition
 */
type LightRayType = {
  id: number;
  startSize: number;
  endSize: number;
  startPosition: number;
  endPosition: number;
  duration: number;
  time: number;
  alpha: number;
};

/**
 * Component Properties
 */
type WaterLightRaysProps = {
  /**
   * Total number of light rays to display
   */
  totalRays?: number;
  /**
   * Maximum opacity value for rays at top
   */
  alphaTop?: number;
  /**
   * Minimum opacity value for rays at bottom
   */
  alphaBottom?: number;
  /**
   * Percentage of screen height to cover with light rays
   */
  heightPercentage?: number;
};

/**
 * Animated water light rays effect component
 */
export const WaterLightRays: React.FC<WaterLightRaysProps> = ({
  totalRays = 20,
  alphaTop = 0.6,
  alphaBottom = 0.1,
  heightPercentage = 75,
}) => {
  // Component State
  const [rays, setRays] = useState<LightRayType[]>([]);
  const { width, height } = Dimensions.get("window");
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const raysHeight = (height * heightPercentage) / 100;

  /**
   * Generate random number between min and max
   */
  const randomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  /**
   * Create a new light ray with random properties
   */
  const createRay = (id: number, initial: boolean = false): LightRayType => {
    const startPosition = randomNumber(-20, 90);
    const distance = randomNumber(5, 50);
    const duration = randomNumber(50, 150) * distance;

    return {
      id,
      startSize: randomNumber(3, 8),
      endSize: randomNumber(3, 8),
      startPosition,
      endPosition: startPosition + distance,
      duration,
      time: initial ? randomNumber(0, duration) : 0,
      alpha: 0,
    };
  };

  /**
   * Update light ray positions and animations
   */
  const updateRays = () => {
    setRays((prevRays) => {
      let updatedRays = [...prevRays];

      // Add new rays if needed
      while (updatedRays.length < totalRays) {
        updatedRays.push(createRay(Date.now() + Math.random()));
      }

      // Update current rays
      updatedRays = updatedRays.map((ray) => {
        let alpha = 0;
        if (ray.time < ray.duration / 2) {
          alpha = ray.time / (ray.duration / 2);
        } else {
          alpha = 1 - (ray.time - ray.duration / 2) / (ray.duration / 2);
        }

        return {
          ...ray,
          time: ray.time + 1,
          alpha,
        };
      });

      // Remove rays that have completed their cycle
      return updatedRays.filter((ray) => ray.time <= ray.duration);
    });
  };

  /**
   * Initialize light rays and start animation
   */
  useEffect(() => {
    // Create initial rays
    const initialRays = Array.from({ length: totalRays }, (_, i) =>
      createRay(i, true)
    );
    setRays(initialRays);

    // Start animation
    animationRef.current = setInterval(updateRays, 16);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [totalRays, alphaTop, alphaBottom, heightPercentage]);

  /**
   * Calculate appropriate taper for mobile screens
   */
  const calculateTaper = () => {
    // Make taper proportional to screen width instead of height
    // Smaller ratio for mobile, larger for bigger screens
    const baseTaper = width * 0.1; // 10% of screen width
    return Math.min(baseTaper, raysHeight * 0.3); // Don't exceed 30% of height
  };

  /**
   * Create trapezoid-shaped light ray path
   */
  const createRayPath = (
    currentPosition: number,
    currentSize: number,
    rayHeight: number
  ) => {
    const positionX = (currentPosition / 100) * width;
    const sizeX = (currentSize / 100) * width;
    const taper = calculateTaper();

    return `
      M${positionX - taper},0 
      L${positionX + sizeX - taper},0 
      L${positionX + sizeX + taper},${rayHeight} 
      L${positionX + taper},${rayHeight} 
      Z
    `;
  };

  // Render
  return (
    <View style={[styles.container, { height: raysHeight }]}>
      <Svg width={width} height={raysHeight}>
        <Defs>
          <LinearGradient id="rayGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="white" stopOpacity={alphaTop} />
            <Stop offset="1" stopColor="white" stopOpacity={alphaBottom} />
          </LinearGradient>
        </Defs>

        {rays.map((ray) => {
          // Calculate current size and position based on time
          const currentSize =
            ray.startSize +
            ((ray.endSize - ray.startSize) / ray.duration) * ray.time;

          const currentPosition =
            ray.startPosition +
            ((ray.endPosition - ray.startPosition) / ray.duration) * ray.time;

          return (
            <G key={ray.id}>
              <Path
                d={createRayPath(currentPosition, currentSize, raysHeight)}
                fill="url(#rayGradient)"
                opacity={ray.alpha}
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

export default WaterLightRays;
