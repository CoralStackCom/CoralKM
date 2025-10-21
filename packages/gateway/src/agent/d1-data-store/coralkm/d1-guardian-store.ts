import type {
  ICoralKMGuardianPolicy,
  ICoralKMGuardianStore,
  ICoralKMRecoveryRequest,
  ICoralKMShare,
  INamespace,
  RequestPolicy,
} from '@coralkm/core'

/**
 * Column structure for guardian_policies table in D1
 */
interface GuardianPolicyRow {
  requester_did: string
  status: RequestPolicy
}

/**
 * Column structure for guardian_shares table in D1
 */
interface GuardianShareRow {
  owner_did: string
  createdAt: string
  updatedAt: string
  namespace_id: string
  namespace_gateway: string
  threshold: number
  share: string
}

/**
 * Column structure for recovery_requests table in D1
 */
interface RecoveryRequestRow {
  id: string
  device_did: string
  namespace_id: string
  namespace_gateway: string
  createdAt: string
  expiresAt: string
}

/**
 * This class implements the {@link ICoralKMGuardianStore} interface using a Cloudflare D1 database.
 */
export class D1GuardianStore implements ICoralKMGuardianStore {
  // Cloudflare D1 database connection
  private d1DBConnection: D1Database

  /**
   * Creates a new instance of D1GuardianStore
   *
   * @param d1dbConnection A D1 database connection instance
   */
  constructor(d1dbConnection: D1Database) {
    this.d1DBConnection = d1dbConnection
  }

  async getGuardianPolicy(requesterDid: string): Promise<ICoralKMGuardianPolicy | null> {
    const policy = await this.d1DBConnection
      .prepare('SELECT requester_did, status FROM guardian_policies WHERE requester_did = ?')
      .bind(requesterDid)
      .first<GuardianPolicyRow>()

    if (!policy) {
      return null
    }
    return {
      requesterDid: policy.requester_did,
      status: policy.status,
    }
  }

  async setGuardianPolicy(
    requesterDid: string,
    policy: RequestPolicy
  ): Promise<ICoralKMGuardianPolicy> {
    await this.d1DBConnection
      .prepare(
        `INSERT INTO guardian_policies (requester_did, status) VALUES (?, ?)
                 ON CONFLICT(requester_did) DO UPDATE SET status=excluded.status`
      )
      .bind(requesterDid, policy)
      .run()

    return (await this.getGuardianPolicy(requesterDid)) as ICoralKMGuardianPolicy
  }

  async removeGuardianPolicy(requesterDid: string): Promise<boolean> {
    const policy = await this.d1DBConnection
      .prepare('SELECT * FROM guardian_policies WHERE requester_did = ? LIMIT 1')
      .bind(requesterDid)
      .first<GuardianPolicyRow>()
    if (!policy || typeof policy === 'undefined') {
      return false
    }

    await this.d1DBConnection
      .prepare('DELETE FROM guardian_policies WHERE requester_did = ?')
      .bind(requesterDid)
      .run()
    return true
  }

  async isGuardian(gateway: string, nid: string): Promise<boolean> {
    const share = await this.d1DBConnection
      .prepare(
        'SELECT * FROM guardian_shares WHERE namespace_gateway = ? AND namespace_id = ? LIMIT 1'
      )
      .bind(gateway, nid)
      .first<GuardianShareRow>()
    return !!share
  }

  async saveShare(
    ownerDid: string,
    gateway: string,
    nid: string,
    threshold: number,
    share: string
  ): Promise<boolean> {
    await this.d1DBConnection
      .prepare(
        `INSERT INTO guardian_shares (owner_did, namespace_id, namespace_gateway, threshold, share) VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(owner_did) DO UPDATE SET namespace_id=excluded.namespace_id, namespace_gateway=excluded.namespace_gateway, threshold=excluded.threshold, share=excluded.share`
      )
      .bind(ownerDid, nid, gateway, threshold, share)
      .run()

    return true
  }

  async getShare(gateway: string, nid: string): Promise<ICoralKMShare | null> {
    const share = await this.d1DBConnection
      .prepare(
        'SELECT * FROM guardian_shares WHERE namespace_gateway = ? AND namespace_id = ? LIMIT 1'
      )
      .bind(gateway, nid)
      .first<GuardianShareRow>()
    if (!share || typeof share === 'undefined') {
      return null
    }
    return {
      ownerDid: share.owner_did,
      namespace: {
        id: share.namespace_id,
        gateway: share.namespace_gateway,
      },
      updatedAt: new Date(share.updatedAt),
      threshold: share.threshold,
      share: share.share,
    }
  }

  async listShares(): Promise<ICoralKMShare[]> {
    const shares = await this.d1DBConnection
      .prepare('SELECT * FROM guardian_shares')
      .all<GuardianShareRow>()
    return shares.results.map(share => ({
      ownerDid: share.owner_did,
      updatedAt: new Date(share.updatedAt),
      namespace: {
        id: share.namespace_id,
        gateway: share.namespace_gateway,
      },
      threshold: share.threshold,
      share: share.share,
    }))
  }

  async deleteShare(gateway: string, nid: string): Promise<boolean> {
    const namespace = await this.d1DBConnection
      .prepare(
        'SELECT * FROM guardian_shares WHERE namespace_gateway = ? AND namespace_id = ? LIMIT 1'
      )
      .bind(gateway, nid)
      .first<GuardianShareRow>()
    if (!namespace || typeof namespace === 'undefined') {
      return false
    }

    await this.d1DBConnection
      .prepare('DELETE FROM guardian_shares WHERE namespace_gateway = ? AND namespace_id = ?')
      .bind(gateway, nid)
      .run()
    return true
  }

  async saveRecoveryRequest(
    deviceDid: string,
    namespace: INamespace,
    requestId: string,
    expiresAt: string
  ): Promise<ICoralKMRecoveryRequest> {
    await this.d1DBConnection
      .prepare(
        `INSERT INTO recovery_requests (id, device_did, namespace_id, namespace_gateway, expiresAt) VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET device_did=excluded.device_did, namespace_id=excluded.namespace_id, namespace_gateway=excluded.namespace_gateway, expiresAt=excluded.expiresAt`
      )
      .bind(requestId, deviceDid, namespace.id, namespace.gateway_did, expiresAt)
      .run()

    return this.getRecoveryRequest(requestId) as Promise<ICoralKMRecoveryRequest>
  }

  async getRecoveryRequest(requestId: string): Promise<ICoralKMRecoveryRequest | null> {
    const request = await this.d1DBConnection
      .prepare('SELECT * FROM recovery_requests WHERE id = ? LIMIT 1')
      .bind(requestId)
      .first<RecoveryRequestRow>()

    if (!request || typeof request === 'undefined') {
      return null
    }

    return {
      id: request.id,
      deviceDid: request.device_did,
      namespace: {
        id: request.namespace_id,
        gateway_did: request.namespace_gateway,
      },
      createdAt: new Date(request.createdAt),
      expiresAt: new Date(request.expiresAt),
    }
  }

  async deleteRecoveryRequest(requestId: string): Promise<boolean> {
    const request = await this.d1DBConnection
      .prepare('SELECT * FROM recovery_requests WHERE id = ? LIMIT 1')
      .bind(requestId)
      .first<RecoveryRequestRow>()

    if (!request || typeof request === 'undefined') {
      return false
    }
    await this.d1DBConnection
      .prepare('DELETE FROM recovery_requests WHERE id = ?')
      .bind(requestId)
      .run()
    return true
  }
}
