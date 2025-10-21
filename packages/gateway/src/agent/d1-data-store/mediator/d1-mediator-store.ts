import type { IMediationStore, MediationPolicy, MediationResponse } from '@coralkm/core'

/**
 * Table schema for storing identifiers in D1
 */
export interface MediationPolicySchema {
  requester_did: string
  status: MediationResponse
}

/**
 * Table schema for storing mediation relationships in D1
 */
export interface MediationSchema {
  recipient_did: string
  requester_did: string
}

/**
 * D1MediatorStore implements the IMediationStore interface using Cloudflare D1 as the backend.
 */
export class D1MediatorStore implements IMediationStore {
  // Cloudflare D1 database connection
  private d1DBConnection: D1Database

  /**
   * Initialise the D1MediatorStore with a D1 database connection.
   *
   * @param d1dbConnection A D1 database connection instance
   */
  constructor(d1DBConnection: D1Database) {
    this.d1DBConnection = d1DBConnection
  }

  /**
   * Get the Mediation policy for a specific requester DID.
   *
   * @param requesterDid The DID of the requester.
   * @returns The policy for the requester DID, or null if none exists.
   */
  async getMediationPolicy(requesterDid: string): Promise<MediationPolicy | null> {
    const policy = await this.d1DBConnection
      .prepare('SELECT requester_did, status FROM mediation_policies WHERE requester_did = ?')
      .bind(requesterDid)
      .first<MediationPolicySchema>()

    if (!policy) {
      return null
    }
    // Fetch associated recipient DIDs
    const mediations = await this.d1DBConnection
      .prepare('SELECT recipient_did FROM mediations WHERE requester_did = ?')
      .bind(requesterDid)
      .all<{ recipient_did: string }>()

    return {
      requesterDid: policy.requester_did,
      status: policy.status,
      recipientDids: mediations.results.map(m => m.recipient_did),
    }
  }
  /**
   * Insert or update a Mediation policy for a specific requester DID.
   *
   * @param requesterDid  The DID of the requester.
   * @returns             The policy for the requester DID.
   */
  async setMediationPolicy(
    requesterDid: string,
    policy: MediationResponse
  ): Promise<MediationPolicy> {
    await this.d1DBConnection
      .prepare(
        `INSERT INTO mediation_policies (requester_did, status) VALUES (?, ?)
         ON CONFLICT(requester_did) DO UPDATE SET status=excluded.status`
      )
      .bind(requesterDid, policy)
      .run()

    return (await this.getMediationPolicy(requesterDid)) as MediationPolicy
  }
  /**
   * Remove the Mediation policy for a specific requester DID.
   *
   * @param requesterDid The DID of the requester.
   * @returns            True if a policy was removed, false if none existed.
   */
  async removeMediationPolicy(requesterDid: string): Promise<boolean> {
    const policy = await this.d1DBConnection
      .prepare('SELECT * FROM mediation_policies WHERE requester_did = ? LIMIT 1')
      .bind(requesterDid)
      .first<MediationPolicySchema>()
    if (!policy || typeof policy === 'undefined') {
      return false
    }

    await this.d1DBConnection
      .prepare('DELETE FROM mediation_policies WHERE requester_did = ?')
      .bind(requesterDid)
      .run()
    return true
  }
  /**
   * Get the mediation policy for a specific recipient DID.
   *
   * @param recipientDid The DID of the recipient.
   */
  async getMediation(recipientDid: string): Promise<MediationPolicy | null> {
    const requesterDid = await this.d1DBConnection
      .prepare('SELECT requester_did FROM mediations WHERE recipient_did = ? LIMIT 1')
      .bind(recipientDid)
      .first<{ requester_did: string }>()
    if (!requesterDid) {
      return null
    }
    return this.getMediationPolicy(requesterDid.requester_did)
  }
  /**
   * Add a mediation relationship between a recipient DID and a mediator DID.
   *
   * @param recipientDid The DID of the recipient.
   * @param requesterDid  The DID of the requester.
   * @returns            True if the mediation was added, false if it already existed.
   */
  async addMediation(recipientDid: string, requesterDid: string): Promise<boolean> {
    await this.d1DBConnection
      .prepare(
        `INSERT INTO mediations (recipient_did, requester_did) VALUES (?, ?)
         ON CONFLICT(recipient_did) DO NOTHING`
      )
      .bind(recipientDid, requesterDid)
      .run()
    return true
  }
  /**
   * Remove a mediation relationship for a specific recipient DID.
   *
   * @param recipientDid The DID of the recipient.
   * @returns            True if the mediation was removed, false if none existed.
   */
  async removeMediation(recipientDid: string): Promise<boolean> {
    await this.d1DBConnection
      .prepare('DELETE FROM mediations WHERE recipient_did = ?')
      .bind(recipientDid)
      .run()
    return true
  }
}
