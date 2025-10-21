import type { IAgentUserProfile } from './types'

/**
 * Interface for User Profile Store
 *
 * This store is used by the user-profile protocol to fetch user profiles for DIDs which can then be returned
 * by the protocol handler.
 */
export interface IUserProfileStore {
  /**
   * Get the user profile for a given DID. Should provide a default profile if none is set.
   *
   * @param did   The decentralized identifier of the user or `*` for default profile
   * @returns     The user profile associated with the DID
   */
  getProfile(did: string): Promise<IAgentUserProfile>
  /**
   * Set the user profile for a given DID.
   *
   * @param did       The decentralized identifier of the user or `*` for default profile
   * @param profile   The user profile to associate with the DID
   */
  setProfile(did: string, profile: IAgentUserProfile): Promise<IAgentUserProfile>
  /**
   * Remove the user profile for a given DID.
   *
   * @param did The decentralized identifier of the user
   */
  removeProfile(did: string): Promise<boolean>
}

/**
 * In-memory implementation of the User Profile Store
 */
export class MemoryUserProfileStore implements IUserProfileStore {
  private profiles: Map<string, IAgentUserProfile> = new Map()

  async getProfile(did: string): Promise<IAgentUserProfile> {
    return this.profiles.get(did) || this.profiles.get('*') || { displayName: 'Unknown User' }
  }

  async setProfile(did: string, profile: IAgentUserProfile): Promise<IAgentUserProfile> {
    this.profiles.set(did, profile)
    return profile
  }

  async removeProfile(did: string): Promise<boolean> {
    return this.profiles.delete(did)
  }
}
