import { INamespace, RequestPolicy } from '../types'

/**
 * Interface representing a Guardian Policy
 */
export interface ICoralKMGuardianPolicy {
  /**
   * The DID of the requester.
   */
  requesterDid: string
  /**
   * The policy status for the requester DID.
   * Can be "GRANTED" or "DENIED".
   */
  status: RequestPolicy
}

/**
 * A share associated with a namespace
 */
export interface ICoralKMShare {
  /**
   * The DID of the namespace owner.
   */
  ownerDid: string
  /**
   * The namespace for which the share is saved.
   */
  namespace: {
    /**
     * The Unique ID of the namespace for the gateway (UUID).
     */
    id: string
    /**
     * The DID of the namespace gateway provider with services to monitor namespaces.
     */
    gateway: string
  }
  /**
   * The date the share was last updated or created.
   */
  updatedAt: Date
  /**
   * The threshold number of shares required for recovery.
   */
  threshold: number
  /**
   * The recovery share for the namespace.
   */
  share: string
}

/**
 * Interface representing a CoralKM Recovery Request
 */
export interface ICoralKMRecoveryRequest {
  /**
   * The unique identifier for the recovery request.
   */
  id: string
  /**
   * The DID of the device requesting recovery.
   */
  deviceDid: string
  /**
   * The namespace being recovered.
   */
  namespace: INamespace
  /**
   * The date the recovery request was created.
   */
  createdAt: Date
  /**
   * The date the recovery request expires.
   */
  expiresAt: Date
}

/**
 * Interface for CoralKM Guardian Store
 *
 * This store is used by Guardians to manage shares on behalf of users.
 */
export interface ICoralKMGuardianStore {
  /**
   * Get the Guardian policy for a specific requester DID.
   *
   * @param requesterDid  The DID of the requester.
   * @returns             The policy for the requester DID, or null if none exists.
   */
  getGuardianPolicy(requesterDid: string): Promise<ICoralKMGuardianPolicy | null>
  /**
   * Insert or update a Guardian policy for a specific requester DID.
   *
   * @param requesterDid  The DID of the requester.
   * @param policy        The policy to set for the requester DID.
   * @returns             The policy for the requester DID.
   */
  setGuardianPolicy(requesterDid: string, policy: RequestPolicy): Promise<ICoralKMGuardianPolicy>
  /**
   * Remove the Guardian policy for a specific requester DID.
   *
   * @param requesterDid The DID of the requester.
   * @returns            True if a policy was removed, false if none existed.
   */
  removeGuardianPolicy(requesterDid: string): Promise<boolean>
  /**
   * Given a gateway and namespace ID, checks if the guardian store has a share for it to
   * start the recovery process.
   *
   * @param gateway The DID of the namespace gateway provider.
   * @param nid     The unique namespace ID for the gateway.
   * @returns       True if the guardian store has a share for the given gateway and namespace ID, false otherwise.
   */
  isGuardian(gateway: string, nid: string): Promise<boolean>
  /**
   * Saves a share for the given namespace
   *
   * @param ownerDid    The decentralized identifier of the namespace owner.
   * @param gateway     The DID of the namespace gateway provider.
   * @param nid         The unique namespace ID for the gateway.
   * @param threshold   The threshold number of shares required for recovery.
   * @param share       The share data to be saved.
   * @returns           True if the share was saved successfully, false otherwise.
   */
  saveShare(
    ownerDid: string,
    gateway: string,
    nid: string,
    threshold: number,
    share: string
  ): Promise<boolean>
  /**
   * Get the share for the given namespace
   *
   * @param gateway The DID of the namespace gateway provider.
   * @param nid     The unique namespace ID for the gateway.
   * @returns       The share or null if not found.
   */
  getShare(gateway: string, nid: string): Promise<ICoralKMShare | null>
  /**
   * Lists all shares stored in the guardian store
   *
   * @returns An array of all stored shares
   */
  listShares(): Promise<ICoralKMShare[]>
  /**
   * Deletes the share for the given namespace
   *
   * @param gateway The DID of the namespace gateway provider.
   * @param nid     The unique namespace ID for the gateway.
   * @return        True if the share was deleted successfully, false otherwise.
   */
  deleteShare(gateway: string, nid: string): Promise<boolean>
  /**
   * Saves a recovery request for a namespace it is guardian for
   *
   * @param deviceDid The decentralized identifier of the device.
   * @param namespace The namepsace being recovered.
   * @param requestId The unique identifier for the recovery request.
   * @param expiresAt The ISO date the recovery request expires.
   * @returns         The saved recovery request.
   */
  saveRecoveryRequest(
    deviceDid: string,
    namespace: INamespace,
    requestId: string,
    expiresAt: string
  ): Promise<ICoralKMRecoveryRequest>
  /**
   * Gets a recovery request by its unique identifier
   *
   * @param requestId The unique identifier for the recovery request.
   * @returns         The challenge ID and creation date of the recovery request, or null if not found.
   */
  getRecoveryRequest(requestId: string): Promise<ICoralKMRecoveryRequest | null>
  /**
   * Delete a recovery request by its unique identifier
   *
   * @param requestId The unique identifier for the recovery request.
   * @returns         True if the recovery request was deleted successfully, false otherwise.
   */
  deleteRecoveryRequest(requestId: string): Promise<boolean>
}

/**
 * This class implements the {@link ICoralKMGuardianStore} interface using an in-memory store.
 */
export class MemoryGuardianStore implements ICoralKMGuardianStore {
  private guardianPolicies: Map<string, ICoralKMGuardianPolicy> = new Map()
  private shares: Map<string, ICoralKMShare> = new Map()
  private recoveryRequests: Map<string, ICoralKMRecoveryRequest> = new Map()

  async getGuardianPolicy(requesterDid: string): Promise<ICoralKMGuardianPolicy | null> {
    return this.guardianPolicies.get(requesterDid) || null
  }

  async setGuardianPolicy(
    requesterDid: string,
    policy: RequestPolicy
  ): Promise<ICoralKMGuardianPolicy> {
    this.guardianPolicies.set(requesterDid, { requesterDid, status: policy })
    return this.guardianPolicies.get(requesterDid)!
  }

  async removeGuardianPolicy(requesterDid: string): Promise<boolean> {
    this.guardianPolicies.delete(requesterDid)
    // Remove any shares associated with this requesterDid
    this.shares.forEach((share, key) => {
      if (share.ownerDid === requesterDid) {
        this.shares.delete(key)
      }
    })
    return !this.guardianPolicies.has(requesterDid)
  }

  async isGuardian(gateway: string, nid: string): Promise<boolean> {
    const key = await this._hashKey(gateway, nid)
    return this.shares.has(key)
  }

  async saveShare(
    ownerDid: string,
    gateway: string,
    nid: string,
    threshold: number,
    share: string
  ): Promise<boolean> {
    const policy = await this.getGuardianPolicy(ownerDid)
    if (!policy || policy.status !== 'GRANTED') {
      throw new Error('Cannot save share: Guardian policy not granted for this owner DID.')
    }
    const shareData: ICoralKMShare = {
      ownerDid,
      updatedAt: new Date(),
      namespace: { id: nid, gateway },
      threshold,
      share,
    }
    const key = await this._hashKey(gateway, nid)
    this.shares.set(key, shareData)
    console.log('Saved share for ownerDid:', shareData)
    return true
  }

  async getShare(gateway: string, nid: string): Promise<ICoralKMShare | null> {
    const key = await this._hashKey(gateway, nid)
    return this.shares.get(key) || null
  }

  async listShares(): Promise<ICoralKMShare[]> {
    return Array.from(this.shares.values())
  }

  async deleteShare(gateway: string, nid: string): Promise<boolean> {
    const key = await this._hashKey(gateway, nid)
    return this.shares.delete(key)
  }

  async saveRecoveryRequest(
    deviceDid: string,
    namespace: INamespace,
    requestId: string,
    expiresAt: string
  ): Promise<ICoralKMRecoveryRequest> {
    const recoveryRequest: ICoralKMRecoveryRequest = {
      id: requestId,
      deviceDid,
      namespace,
      createdAt: new Date(),
      expiresAt: new Date(expiresAt),
    }
    this.recoveryRequests.set(requestId, recoveryRequest)
    return recoveryRequest
  }

  async getRecoveryRequest(requestId: string): Promise<ICoralKMRecoveryRequest | null> {
    return this.recoveryRequests.get(requestId) || null
  }

  async deleteRecoveryRequest(requestId: string): Promise<boolean> {
    return this.recoveryRequests.delete(requestId)
  }

  /**
   * Helper method to hash (using SHA-256) the gateway and namespace into a unique key
   *
   * @param gateway The DID of the namespace gateway provider.
   * @param nid     The unique namespace ID for the gateway.
   * @returns
   */
  private async _hashKey(gateway: string, nid: string): Promise<string> {
    const data = new TextEncoder().encode(`${gateway}:${nid}`)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }
}
