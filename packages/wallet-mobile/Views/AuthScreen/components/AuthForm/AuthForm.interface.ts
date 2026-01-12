/**
 * AuthForm Properties
 */
export interface AuthFormProps {
  /**
   * Flag to determine if the form is focused
   * @default false
   */
  focused?: boolean
  /**
   * Callback for when Sign In button clicked to login an
   * existing user. Throws errors if any authentication issues
   */
  onAuthenticate: (oob_code: string) => Promise<void>
  /**
   * Callback triggered when fish splash into the water
   */
  onSplash: () => void
  /**
   * Callback for when user clicks to back to start of login process
   * if they haven't received their OOB code yet
   */
  onBack: () => void
}
