/**
 * Component Properties
 */
export type EntropyScreenProps = {
  /**
   * Callback function called when entropy/seed value changes
   */
  onChange?: (seed: string) => void;
  /**
   * Reference to the entropy screen component
   */
  ref?: React.Ref<any>;
  /**
   * Size of the entropy generator component
   */
  size?: number;
};
