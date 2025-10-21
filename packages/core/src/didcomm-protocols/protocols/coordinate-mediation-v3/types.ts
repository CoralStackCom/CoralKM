/**
 * Can be "ALLOW" or "DENY" and is used to determine whether a mediation request for a specific {@link RequesterDid} should be ALLOW or DENY.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export type PreMediationRequestPolicy = 'ALLOW' | 'DENY'

/**
 * Can be "GRANTED" or "DENIED" and is used to record whether a mediation response for a specific {@link RequesterDid} has been granted or denied.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export type MediationResponse = 'GRANTED' | 'DENIED'

/**
 * Mediation policy for a specific requester DID.
 */
export type MediationPolicy = {
  /**
   * The DID of the requester that controls the Mediation policy.
   */
  requesterDid: string
  /**
   * The status of the mediation request policy (GRANTED or DENIED).
   */
  status: MediationResponse
  /**
   * Optional list of recipient DIDs associated with this policy.
   */
  recipientDids?: string[]
}

/**
 * Mediation Store interface
 *
 * Provides methods to manage mediation state for CoordinateMediationV3 protocol
 * Mediators
 */
export interface IMediationStore {
  /**
   * Get the Mediation policy for a specific requester DID.
   *
   * @param requesterDid The DID of the requester.
   * @returns The policy for the requester DID, or null if none exists.
   */
  getMediationPolicy(requesterDid: string): Promise<MediationPolicy | null>
  /**
   * Insert or update a Mediation policy for a specific requester DID.
   *
   * @param requesterDid  The DID of the requester.
   * @returns             The policy for the requester DID.
   */
  setMediationPolicy(requesterDid: string, policy: MediationResponse): Promise<MediationPolicy>
  /**
   * Remove the Mediation policy for a specific requester DID.
   *
   * @param requesterDid The DID of the requester.
   * @returns            True if a policy was removed, false if none existed.
   */
  removeMediationPolicy(requesterDid: string): Promise<boolean>
  /**
   * Get the mediation policy for a specific recipient DID.
   *
   * @param recipientDid The DID of the recipient.
   */
  getMediation(recipientDid: string): Promise<MediationPolicy | null>
  /**
   * Add a mediation relationship between a recipient DID and a mediator DID.
   *
   * @param recipientDid The DID of the recipient.
   * @param requesterDid  The DID of the requester.
   * @returns            True if the mediation was added, false if it already existed.
   */
  addMediation(recipientDid: string, requesterDid: string): Promise<boolean>
  /**
   * Remove a mediation relationship for a specific recipient DID.
   *
   * @param recipientDid The DID of the recipient.
   * @returns            True if the mediation was removed, false if none existed.
   */
  removeMediation(recipientDid: string): Promise<boolean>
}
