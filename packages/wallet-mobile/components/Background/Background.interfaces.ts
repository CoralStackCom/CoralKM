/**
 * Component Properties
 */
export type ViewType = 'land' | 'underwater' | 'sky';
export type PhaseType = 'day' | 'morning' | 'evening' | 'night';

export type BackgroundProps = {
  /**
   * Whether to disable background animations
   */
  disableAnimations?: boolean;
  /**
   * Current background view type
   */
  view?: ViewType;
  /**
   * Time of day phase for background
   */
  phase?: PhaseType;
  /**
   * Frequency to update background phase (in minutes)
   */
  updateFrequency?: number;
  /**
   * Callback function called when background transition completes
   */
  onTransitionEnd?: (view: ViewType) => void;
};

/**
 * GlimmerData interface.
 *
 * Represents a single glimmer/particle in the background animation.
 */

export interface GlimmerData {
  /** Unique identifier */
  id: number;

  /** Size of the glimmer */
  size: number;

  /** X position */
  x: number;

  /** Y position */
  y: number;

  /** Duration of the animation */
  duration: number;

  /** Delay before the animation starts */
  delay: number;
}

/**
 * LightRayData interface.
 *
 * Represents a single light ray in the background animation.
 */

export interface LightRayData {
  /** Unique identifier */
  id: number;

  /** Starting size of the light ray */
  startSize: number;

  /** Ending size of the light ray */
  endSize: number;

  /** Starting position */
  startPosition: number;

  /** Ending position */
  endPosition: number;

  /** Duration of the animation */
  duration: number;

  /** Delay before the animation starts */
  delay: number;
}

/**
 * FishData interface.
 *
 * Represents a single fish animation in the background.
 */

export interface FishData {
  /** Unique identifier */
  id: number;

  /** Size of the fish */
  size: number;

  /** Color of the fish */
  color: string;

  /** Starting X position */
  startX: number;

  /** Starting Y position */
  startY: number;

  /** Ending X position */
  endX: number;

  /** Ending Y position */
  endY: number;

  /** Duration of the animation */
  duration: number;

  /** Delay before the animation starts */
  delay: number;

  /** Direction of movement */
  direction: 'left' | 'right';
}
