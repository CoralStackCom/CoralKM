/**
 * Component Properties
 */
export type ViewType = "land" | "underwater" | "sky";
export type PhaseType = "day" | "morning" | "evening" | "night";

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
