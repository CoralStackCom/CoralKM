/**
 * Component Properties
 */
export interface OOBFieldProps {
  /**
   * Number of digits in the OOB code
   */
  digitCount?: number;
  /**
   * Callback function called when OOB code is submitted
   */
  onSubmit?: (code: string) => Promise<void> | void;
}
