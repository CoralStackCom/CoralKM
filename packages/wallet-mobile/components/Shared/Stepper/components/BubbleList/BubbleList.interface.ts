export interface BubbleListProps {
  /**
   * Total number of steps in the stepper
   */
  totalSteps: number;
  /**
   * Currently active step number
   */
  activeStep: number;
  /**
   * Labels for each step bubble
   */
  labels: string[];
}
