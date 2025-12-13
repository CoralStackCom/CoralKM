/**
 * User interface definition
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;
  /**
   * User's first name
   */
  firstName: string;
  /**
   * User's last name
   */
  lastName: string;
  /**
   * User's email address
   */
  email: string;
  /**
   * Optional avatar image URL or path
   */
  avatar?: string;
}
