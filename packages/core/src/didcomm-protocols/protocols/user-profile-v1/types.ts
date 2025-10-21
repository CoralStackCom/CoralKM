/**
 * Structure of a User Profile
 */
export interface IAgentUserProfile {
  /** The display name of the agent */
  displayName: string
  /** Base64 encoded PNG avatar of the agent */
  displayPicture?: string
  /** A short description or bio of the agent */
  description?: string
}
