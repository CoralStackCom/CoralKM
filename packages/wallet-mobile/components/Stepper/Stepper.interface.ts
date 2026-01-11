/**
 * Component Properties
 */
export interface StepperProps {
  /**
   * Array of step components to display
   */
  children: React.ReactNode[];
  /**
   * Currently active step index
   */
  activeStep: number;
  /**
   * Labels for each step in the stepper
   */
  labels: string[];
  /**
   * Whether the stepper is open/expanded
   */
  open?: boolean;
  /**
   * Callback function called when step transition completes
   */
  onTransitionEnd?: () => void;
}
