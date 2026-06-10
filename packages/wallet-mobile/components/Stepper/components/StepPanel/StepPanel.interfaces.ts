/**
 * Component Properties
 */
export interface StepProps {
  /**
   * Title displayed at the top of the step
   */
  title: string;
  /**
   * Label for the next step button
   */
  nextStep: string;
  /**
   * Step content to be displayed
   */
  children: React.ReactNode;
  /**
   * Whether the step is ready to proceed
   */
  isReady?: boolean;
  /**
   * Callback function called when cancel is pressed
   */
  onCancel?: () => void;
  /**
   * Callback function called when next step is pressed
   */
  onNext: () => void;
}
