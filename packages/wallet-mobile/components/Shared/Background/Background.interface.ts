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
 * @typedef {Object} GlimmerData
 * @property {number} id
 * @property {number} size
 * @property {number} x
 * @property {number} y
 * @property {number} duration
 * @property {number} delay
 */

export interface GlimmerData {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
}
/**
 * @typedef {Object} LightRayData
 * @property {number} id
 * @property {number} startSize
 * @property {number} endSize
 * @property {number} startPosition
 * @property {number} endPosition
 * @property {number} duration
 * @property {number} delay
 */

export interface LightRayData {
  id: number
  startSize: number
  endSize: number
  startPosition: number
  endPosition: number
  duration: number
  delay: number
}

/**
 * @typedef {Object} FishData
 * @property {number} id
 * @property {number} size
 * @property {string} color
 * @property {number} startX
 * @property {number} startY
 * @property {number} endX
 * @property {number} endY
 * @property {number} duration
 * @property {number} delay
 * @property {'left' | 'right'} direction
 */
export interface FishData {
  id: number
  size: number
  color: string
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  delay: number
  direction: 'left' | 'right'
}
