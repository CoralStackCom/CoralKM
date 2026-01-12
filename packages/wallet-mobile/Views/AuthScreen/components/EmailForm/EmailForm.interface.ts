/**
 * EmailForm Properties
 */
export interface EmailFormProps {
  /**
   * Current email used for password reset
   */
  email?: string
  /**
   * Is the input focused
   * @default false
   */
  focused?: boolean
  /**
   * Callback to call API to get OOB Code sent to email address.
   * Will throw any errors as exceptions
   */
  onGetOOBCode: (email: string) => Promise<void>
  /**
   * Callback to take user to next screen
   */
  onNext: () => void
}
