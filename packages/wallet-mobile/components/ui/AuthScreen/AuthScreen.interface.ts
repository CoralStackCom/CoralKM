/**
 * Component Properties
 */
export interface AuthScreenProps {
  /**
   * Callback function to request OOB code for email verification
   */
  onGetOOBCode: (email: string) => Promise<void>;
  /**
   * Callback function to authenticate with OOB code
   */
  onAuthenticate: (oobCode: string) => Promise<void>;
  /**
   * Whether the user is currently authenticated
   */
  isAuthenticated?: boolean;
  /**
   * Whether to disable the background animation
   */
  disableBackgroundAnimation?: boolean;
  /**
   * Additional children components to render
   */
  children?: React.ReactNode;
}
