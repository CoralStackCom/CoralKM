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
  // In-memory cache for mediation policies (keyed by requester_did)
  private policyCache: Map<string, MediationPolicy> = new Map()
  // In-memory cache for recipient -> requester mappings
  private recipientCache: Map<string, string> = new Map()

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
    // Check cache first
    const cached = this.policyCache.get(requesterDid)
    if (cached) {
      return cached
    }

    // Single query with LEFT JOIN to get policy and recipient DIDs
    const sql = `
      SELECT
        p.requester_did,
        p.status,
        COALESCE(
          json_group_array(m.recipient_did) FILTER (WHERE m.recipient_did IS NOT NULL),
          json('[]')
        ) AS recipient_dids
      FROM mediation_policies p
      LEFT JOIN mediations m ON m.requester_did = p.requester_did
      WHERE p.requester_did = ?
      GROUP BY p.requester_did
    `

    const row = await this.d1DBConnection.prepare(sql).bind(requesterDid).first<any>()

    if (!row) {
      return null
    }

    const recipientDids =
      typeof row.recipient_dids === 'string' ? JSON.parse(row.recipient_dids) : []

    const policy: MediationPolicy = {
      requesterDid: row.requester_did,
      status: row.status,
      recipientDids,
    }

    // Cache the result and update recipient cache
    this.policyCache.set(requesterDid, policy)
    for (const recipientDid of recipientDids) {
      this.recipientCache.set(recipientDid, requesterDid)
    }

    return policy
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

    // Invalidate cache
    this.policyCache.delete(requesterDid)
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

    // Invalidate caches - clear policy and any recipient mappings
    const cachedPolicy = this.policyCache.get(requesterDid)
    if (cachedPolicy?.recipientDids) {
      for (const recipientDid of cachedPolicy.recipientDids) {
        this.recipientCache.delete(recipientDid)
      }
    }
    this.policyCache.delete(requesterDid)
    return true
  }

  /**
   * Get the mediation policy for a specific recipient DID.
   *
   * @param recipientDid The DID of the recipient.
   */
  async getMediation(recipientDid: string): Promise<MediationPolicy | null> {
    // Check recipient cache first
    const cachedRequester = this.recipientCache.get(recipientDid)
    if (cachedRequester) {
      return this.getMediationPolicy(cachedRequester)
    }

    const requesterDid = await this.d1DBConnection
      .prepare('SELECT requester_did FROM mediations WHERE recipient_did = ? LIMIT 1')
      .bind(recipientDid)
      .first<{ requester_did: string }>()
    if (!requesterDid) {
      return null
    }

    // Cache the recipient -> requester mapping
    this.recipientCache.set(recipientDid, requesterDid.requester_did)
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

    // Update caches
    this.recipientCache.set(recipientDid, requesterDid)
    this.policyCache.delete(requesterDid) // Invalidate to refresh recipientDids list
    return true
  }

  /**
   * Remove a mediation relationship for a specific recipient DID.
   *
   * @param recipientDid The DID of the recipient.
   * @returns            True if the mediation was removed, false if none existed.
   */
  async removeMediation(recipientDid: string): Promise<boolean> {
    // Get the requester before deleting to invalidate correct caches
    const requesterDid = this.recipientCache.get(recipientDid)

    await this.d1DBConnection
      .prepare('DELETE FROM mediations WHERE recipient_did = ?')
      .bind(recipientDid)
      .run()

    // Invalidate caches
    this.recipientCache.delete(recipientDid)
    if (requesterDid) {
      this.policyCache.delete(requesterDid) // Invalidate to refresh recipientDids list
    }
    return true
  }
}
