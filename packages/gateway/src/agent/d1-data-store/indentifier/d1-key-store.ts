import { IKey, ManagedKeyInfo } from '@veramo/core-types'
import { AbstractKeyStore } from '@veramo/key-manager'
import Debug from 'debug'

import type { Key } from './types'

const debug = Debug('veramo:d1db:key-store')

/**
 * An implementation of {@link @veramo/key-manager#AbstractKeyStore | AbstractKeyStore} that uses a Cloudflare D1 database to
 * store the relationships between keys, their IDs, aliases and
 * {@link @veramo/key-manager#AbstractKeyManagementSystem | KMS implementations}, as they are known and managed by a
 * Veramo agent.
 *
 * An instance of this class can be used by {@link @veramo/key-manager#KeyManager} as the data storage layer.
 *
 * To make full use of this class, it should use the same database as the one used by
 * {@link @veramo/data-store#DIDStore | DIDStore}.
 *
 * @public
 */
export class D1KeyStore extends AbstractKeyStore {
  // Cloudflare D1 database connection
  private d1DBConnection: D1Database

  /**
   * Initialise the D1DIDStore with a D1 database connection.
   *
   * @param d1dbConnection A D1 database connection instance
   */
  constructor(d1dbConnection: D1Database) {
    super()
    this.d1DBConnection = d1dbConnection
  }

  async getKey({ kid }: { kid: string }): Promise<IKey> {
    const key = await this.d1DBConnection
      .prepare('SELECT * FROM `keys` WHERE kid = ?')
      .bind(kid)
      .first<Key>()
    if (!key) throw Error('Key not found')
    return {
      kid: key.kid,
      type: key.type,
      publicKeyHex: key.publicKeyHex,
      meta: key.meta ? JSON.parse(key.meta) : undefined,
      kms: key.kms,
    } as IKey
  }

  async deleteKey({ kid }: { kid: string }) {
    const key = await this.d1DBConnection
      .prepare('SELECT * FROM `keys` WHERE kid = ?')
      .bind(kid)
      .first<Key>()
    if (!key) throw Error('Key not found')
    debug('Deleting key', kid)
    await this.d1DBConnection.prepare('DELETE FROM `keys` WHERE kid = ?').bind(kid).run()
    return true
  }

  async importKey(args: IKey) {
    const key: Key = {
      kid: args.kid,
      publicKeyHex: args.publicKeyHex,
      type: args.type,
      kms: args.kms,
      meta: args.meta,
    }
    debug('Saving key', args.kid)
    await this.d1DBConnection
      .prepare('INSERT INTO `keys` (kid, publicKeyHex, type, kms, meta) VALUES (?, ?, ?, ?, ?)')
      .bind(
        key.kid,
        key.publicKeyHex,
        key.type,
        key.kms,
        key.meta ? JSON.stringify(key.meta) : null
      )
      .run()
    return true
  }

  async listKeys(_args: {} = {}): Promise<ManagedKeyInfo[]> {
    const keys = await this.d1DBConnection.prepare('SELECT * FROM `keys`').all<Key>()
    if (!keys.results) return []
    const managedKeys: ManagedKeyInfo[] = keys.results.map(key => {
      const { kid, publicKeyHex, type, meta, kms } = key
      return {
        kid,
        type,
        publicKeyHex,
        meta: meta ? JSON.parse(meta) : undefined,
        kms,
      } as IKey
    })
    return managedKeys
  }
}
