import type {
  ICoralKMNamespace,
  ICoralKMNamespacePolicy,
  ICoralKMNamespaceStore,
  RequestPolicy,
} from '@coralkm/core'

/**
 * Column structure for namespace_policies table in D1
 */
interface NamespacePolicyRow {
  requester_did: string
  status: RequestPolicy
}

/**
 * Column structure for namespaces table in D1
 */
interface NamespaceRow {
  id: string
  owner_did: string
  createdAt: string
  syncedAt: string | null
  data: string | null
}

/**
 * This class implements the {@link ICoralKMNamespaceStore} interface using a Cloudflare D1 database.
 */
export class D1NamespaceStore implements ICoralKMNamespaceStore {
  // Cloudflare D1 database connection
  private d1DBConnection: D1Database
  // The DID of the gateway using this namespace store
  private gatewayDid: string

  /**
   * Creates a new instance of D1NamespaceStore
   *
   * @param d1dbConnection  A D1 database connection instance
   * @param gatewayDid      The DID of the gateway using this namespace store
   */
  constructor(d1dbConnection: D1Database, gatewayDid: string) {
    this.d1DBConnection = d1dbConnection
    this.gatewayDid = gatewayDid
  }

  async getNamespacePolicy(requesterDid: string): Promise<ICoralKMNamespacePolicy | null> {
    const policy = await this.d1DBConnection
      .prepare('SELECT requester_did, status FROM namespace_policies WHERE requester_did = ?')
      .bind(requesterDid)
      .first<NamespacePolicyRow>()

    if (!policy) {
      return null
    }
    return {
      requesterDid: policy.requester_did,
      status: policy.status,
    }
  }

  async setNamespacePolicy(
    requesterDid: string,
    policy: RequestPolicy
  ): Promise<ICoralKMNamespacePolicy> {
    await this.d1DBConnection
      .prepare(
        `INSERT INTO namespace_policies (requester_did, status) VALUES (?, ?)
             ON CONFLICT(requester_did) DO UPDATE SET status=excluded.status`
      )
      .bind(requesterDid, policy)
      .run()

    return (await this.getNamespacePolicy(requesterDid)) as ICoralKMNamespacePolicy
  }

  async removeNamespacePolicy(requesterDid: string): Promise<boolean> {
    const policy = await this.d1DBConnection
      .prepare('SELECT * FROM namespace_policies WHERE requester_did = ? LIMIT 1')
      .bind(requesterDid)
      .first<NamespacePolicyRow>()
    if (!policy || typeof policy === 'undefined') {
      return false
    }

    await this.d1DBConnection
      .prepare('DELETE FROM namespace_policies WHERE requester_did = ?')
      .bind(requesterDid)
      .run()
    return true
  }

  async createNamespace(ownerDid: string): Promise<ICoralKMNamespace> {
    const id = crypto.randomUUID()
    await this.d1DBConnection
      .prepare('INSERT INTO namespaces (id, owner_did, syncedAt, data) VALUES (?, ?, ?, ?)')
      .bind(id, ownerDid, null, null)
      .run()
    return (await this.getNamespace({ id })) as ICoralKMNamespace
  }

  async updateNamespace(ownerDid: string): Promise<ICoralKMNamespace> {
    const id = crypto.randomUUID()
    await this.d1DBConnection
      .prepare('UPDATE namespaces SET id = ? WHERE owner_did = ?')
      .bind(id, ownerDid)
      .run()
    return (await this.getNamespace({ id })) as ICoralKMNamespace
  }

  async getNamespace(
    by: { id: string } | { owner_did: string }
  ): Promise<ICoralKMNamespace | null> {
    let namespace: NamespaceRow | null = null
    if ('id' in by) {
      namespace = await this.d1DBConnection
        .prepare('SELECT id, owner_did, createdAt, syncedAt, data FROM namespaces WHERE id = ?')
        .bind(by.id)
        .first<NamespaceRow>()
    } else if ('owner_did' in by) {
      namespace = await this.d1DBConnection
        .prepare(
          'SELECT id, owner_did, createdAt, syncedAt, data FROM namespaces WHERE owner_did = ?'
        )
        .bind(by.owner_did)
        .first<NamespaceRow>()
    }

    if (!namespace) {
      return null
    }

    return {
      id: namespace.id,
      ownerDid: namespace.owner_did,
      gatewayDid: this.gatewayDid,
      createdAt: new Date(namespace.createdAt),
      syncedAt: namespace.syncedAt ? new Date(namespace.syncedAt) : null,
      data: namespace.data,
    }
  }

  async saveNamespaceData(ownerDid: string, data: string): Promise<string> {
    const namespace = await this.getNamespace({ owner_did: ownerDid })
    if (!namespace) {
      throw new Error(`Namespace for owner DID ${ownerDid} not found`)
    }

    await this.d1DBConnection
      .prepare('UPDATE namespaces SET data = ?, syncedAt = ? WHERE id = ?')
      .bind(data, new Date().toISOString(), namespace.id)
      .run()

    // Get SHA-256 hash of the data
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  async deleteNamespace(id: string): Promise<boolean> {
    const namespace = await this.d1DBConnection
      .prepare('SELECT * FROM namespaces WHERE id = ? LIMIT 1')
      .bind(id)
      .first<NamespaceRow>()
    if (!namespace || typeof namespace === 'undefined') {
      return false
    }

    await this.d1DBConnection.prepare('DELETE FROM namespaces WHERE id = ?').bind(id).run()
    return true
  }
}
