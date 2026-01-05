import { IIdentifier } from '@veramo/core-types'
import { AbstractDIDStore } from '@veramo/did-manager'
import Debug from 'debug'

import type { Identifier, Key, Service } from './types'

const debug = Debug('veramo:d1db:identifier-store')

/**
 * An implementation of {@link @veramo/did-manager#AbstractDIDStore | AbstractDIDStore} that uses a Cloudflare D1 database to
 * store the relationships between DIDs, their providers and controllers and their keys and services as they are known
 * and managed by a Veramo agent.
 *
 * An instance of this class can be used by {@link @veramo/did-manager#DIDManager} as the data storage layer.
 *
 * To make full use of this class, it should use the same database as the one used by
 * {@link @veramo/data-store#KeyStore | KeyStore}.
 *
 * @public
 */
export class D1DIDStore extends AbstractDIDStore {
  // Cloudflare D1 database connection
  private d1DBConnection: D1Database
  // In-memory cache for identifiers (keyed by did)
  private identifierCache: Map<string, IIdentifier> = new Map()

  /**
   * Initialise the D1DIDStore with a D1 database connection.
   *
   * @param d1dbConnection A D1 database connection instance
   */
  constructor(d1dbConnection: D1Database) {
    super()
    this.d1DBConnection = d1dbConnection
  }

  async getDID({
    did,
    alias,
    provider,
  }: {
    did?: string
    alias?: string
    provider?: string
  }): Promise<IIdentifier> {
    // Get requires did or (alias and provider)
    // Argument validation
    if (did && (alias || provider)) {
      throw new Error('Provide either did OR (alias + provider), not both.')
    }

    // Check cache first (only for did-based lookups)
    if (did) {
      const cached = this.identifierCache.get(did)
      if (cached) {
        return cached
      }
    }

    // Build WHERE clause
    let whereClause = ''
    let params: any[] = []

    if (did !== undefined && alias === undefined) {
      whereClause = 'i.did = ?'
      params = [did]
    } else if (did === undefined && alias !== undefined) {
      if (provider === undefined) {
        whereClause = 'i.alias = ?'
        params = [alias]
      } else {
        whereClause = 'i.alias = ? AND i.provider = ?'
        params = [alias, provider]
      }
    } else {
      throw new Error('Must provide either did OR (alias + provider)')
    }

    // Single query to get identifier with keys and services
    const sql = `
      SELECT
        i.did,
        i.provider,
        i.alias,
        i.controllerKeyId,
        COALESCE(s.services, json('[]')) AS services,
        COALESCE(k.keys, json('[]')) AS keys
      FROM identifiers i
      LEFT JOIN (
        SELECT
          identifier_id,
          json_group_array(
            json_object(
              'id', id,
              'type', type,
              'serviceEndpoint', serviceEndpoint,
              'description', description
            )
          ) AS services
        FROM services
        GROUP BY identifier_id
      ) s ON s.identifier_id = i.did
      LEFT JOIN (
        SELECT
          identifier_id,
          json_group_array(
            json_object(
              'kid', kid,
              'type', type,
              'publicKeyHex', publicKeyHex,
              'kms', kms,
              'meta', meta
            )
          ) AS keys
        FROM keys
        GROUP BY identifier_id
      ) k ON k.identifier_id = i.did
      WHERE ${whereClause}
      LIMIT 1
    `

    const row = await this.d1DBConnection
      .prepare(sql)
      .bind(...params)
      .first<any>()
    if (!row) throw Error('Identifier not found')

    // Parse services
    const services = typeof row.services === 'string' ? JSON.parse(row.services) : []
    for (const s of services) {
      try {
        s.serviceEndpoint = JSON.parse(s.serviceEndpoint)
      } catch {}
    }

    // Parse keys
    const keys = typeof row.keys === 'string' ? JSON.parse(row.keys) : []
    for (const k of keys) {
      if (k.meta) {
        try {
          k.meta = JSON.parse(k.meta)
        } catch {}
      }
    }

    const result: IIdentifier = {
      did: row.did,
      controllerKeyId: row.controllerKeyId,
      provider: row.provider as string,
      services,
      keys,
    }
    if (row.alias) {
      result.alias = row.alias as string
    }

    // Cache the result
    this.identifierCache.set(result.did, result)
    return result
  }

  async deleteDID({ did }: { did: string }) {
    const identifier = await this.d1DBConnection
      .prepare('SELECT * FROM identifiers WHERE did = ? LIMIT 1')
      .bind(did)
      .first<Identifier>()
    if (!identifier || typeof identifier === 'undefined') {
      return false
    }
    debug('Deleting', did)
    await this.d1DBConnection.prepare('DELETE FROM identifiers WHERE did = ?').bind(did).run()
    // Invalidate cache
    this.identifierCache.delete(did)
    return true
  }

  async importDID(args: IIdentifier) {
    // Create identifier and save
    const identifier: Identifier = {
      did: args.did,
      provider: args.provider,
    }
    if (args.controllerKeyId) {
      identifier.controllerKeyId = args.controllerKeyId
    }
    if (args.alias) {
      identifier.alias = args.alias
    }
    await this.d1DBConnection
      .prepare(
        `INSERT INTO identifiers (did, provider, alias, controllerKeyId, saveDate, updateDate) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
         ON CONFLICT(did) DO UPDATE SET provider=excluded.provider, alias=excluded.alias, controllerKeyId=excluded.controllerKeyId, updateDate=datetime('now')`
      )
      .bind(
        identifier.did,
        identifier.provider ?? null,
        identifier.alias ?? null,
        identifier.controllerKeyId ?? null
      )
      .run()

    // Save keys
    for (const argsKey of args.keys) {
      const k: Key = {
        kid: argsKey.kid,
        publicKeyHex: argsKey.publicKeyHex,
        type: argsKey.type,
        kms: argsKey.kms,
        meta: argsKey.meta ? JSON.stringify(argsKey.meta) : null,
        identifier_id: args.did,
      }
      await this.d1DBConnection
        .prepare(
          `INSERT INTO keys (kid, type, publicKeyHex, meta, kms, identifier_id) VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(kid) DO UPDATE SET type=excluded.type, publicKeyHex=excluded.publicKeyHex, meta=excluded.meta, kms=excluded.kms, identifier_id=excluded.identifier_id`
        )
        .bind(k.kid, k.type, k.publicKeyHex, k.meta, k.kms, k.identifier_id)
        .run()
    }

    // Save services
    for (const argsService of args.services) {
      const service: Service = {
        id: argsService.id,
        type: argsService.type,
        serviceEndpoint:
          argsService.serviceEndpoint instanceof Object
            ? JSON.stringify(argsService.serviceEndpoint)
            : argsService.serviceEndpoint,
        description: argsService.description || null,
        identifier_id: args.did,
      }
      await this.d1DBConnection
        .prepare(
          `INSERT INTO services (id, type, serviceEndpoint, description, identifier_id) VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET type=excluded.type, serviceEndpoint=excluded.serviceEndpoint, description=excluded.description, identifier_id=excluded.identifier_id`
        )
        .bind(
          service.id,
          service.type,
          service.serviceEndpoint,
          service.description,
          service.identifier_id
        )
        .run()
    }

    debug('Saving', args.did)
    // Invalidate cache so next getDID fetches fresh data
    this.identifierCache.delete(args.did)
    return true
  }

  async listDIDs(args: { alias?: string; provider?: string }): Promise<IIdentifier[]> {
    const { alias, provider } = args ?? {}

    const sql = `
    SELECT
      i.did,
      i.provider,
      i.alias,
      COALESCE(s.services, json('[]')) AS services,
      COALESCE(k.keys,     json('[]')) AS keys
    FROM identifiers i
    LEFT JOIN (
      SELECT
        identifier_id,
        json_group_array(
          json_object(
            'id', id,
            'type', type,
            'serviceEndpoint', serviceEndpoint
          )
        ) AS services
      FROM services
      GROUP BY identifier_id
    ) s ON s.identifier_id = i.did
    LEFT JOIN (
      SELECT
        identifier_id,
        json_group_array(
          json_object(
            'kid', kid,
            'type', type,
            'publicKeyHex', publicKeyHex,
            'kms', kms,
            'meta', meta
          )
        ) AS keys
      FROM keys
      GROUP BY identifier_id
    ) k ON k.identifier_id = i.did
    /* dynamic WHERE goes here */
    %WHERE%
    ORDER BY i.did
  `

    // Build WHERE/params
    const where: string[] = []
    const params: any[] = []

    if (alias !== undefined) {
      where.push('i.alias = ?')
      params.push(alias)
    }
    if (provider !== undefined) {
      where.push('i.provider = ?')
      params.push(provider)
    }

    const finalSql = sql.replace('%WHERE%', where.length ? `WHERE ${where.join(' AND ')}` : '')

    const res = await this.d1DBConnection
      .prepare(finalSql)
      .bind(...params)
      .all<any>()

    const rows: IIdentifier[] = (res.results ?? []).map((r: any): IIdentifier => {
      const services = typeof r.services === 'string' ? JSON.parse(r.services) : []
      for (const s of services) {
        try {
          s.serviceEndpoint = JSON.parse(s.serviceEndpoint)
        } catch {}
      }
      const keys = typeof r.keys === 'string' ? JSON.parse(r.keys) : []
      for (const k of keys) {
        try {
          k.meta = JSON.parse(k.meta)
        } catch {}
      }
      return {
        did: r.did,
        provider: r.provider ?? null,
        alias: r.alias ?? null,
        services,
        keys,
      }
    })

    return rows
  }
}
