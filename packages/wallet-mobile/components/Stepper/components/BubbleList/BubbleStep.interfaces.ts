export interface BubbleStepProps {
  /**
   * Text label displayed below the bubble
   */
  label: string;
  /**
   * Step number displayed inside the bubble
   */
  stepNumber: number;
  /**
   * Whether this step is currently active
   */
  isActive?: boolean;
  /**
   * Whether this step has been completed
   */
  isComplete?: boolean;
  /**
   * Animation delay for showing the bubble
   */
  showDelay?: number;
}
