import {
  AbstractPrivateKeyStore,
  AbstractSecretBox,
  ImportablePrivateKey,
  ManagedPrivateKey,
} from '@veramo/key-manager'
import Debug from 'debug'
import { v4 as uuid4 } from 'uuid'

import type { PrivateKey } from './types'

const debug = Debug('veramo:d1db:key-store')

/**
 * An implementation of {@link @veramo/key-manager#AbstractPrivateKeyStore | AbstractPrivateKeyStore} that uses a
 * Cloudflare D1 database connection to store private key material.
 *
 * The keys can be encrypted while at rest if this class is initialized with an
 * {@link @veramo/key-manager#AbstractSecretBox | AbstractSecretBox} implementation.
 *
 * @public
 */
export class D1PrivateKeyStore extends AbstractPrivateKeyStore {
  // Cloudflare D1 database connection
  private d1DBConnection: D1Database
  // Optional secret box for encrypting keys at rest
  private secretBox?: AbstractSecretBox | undefined

  /**
   * Initialise the D1DIDStore with a D1 database connection.
   *
   * @param d1dbConnection A D1 database connection instance
   */
  constructor(d1dbConnection: D1Database, secretBox?: AbstractSecretBox) {
    super()
    this.d1DBConnection = d1dbConnection
    if (!secretBox) {
      console.warn('Please provide SecretBox to the KeyStore')
    }
    this.secretBox = secretBox
  }

  async getKey({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    const key = await this.d1DBConnection
      .prepare('SELECT * FROM `private-keys` WHERE alias = ?')
      .bind(alias)
      .first<PrivateKey>()

    if (!key) throw Error('Key not found')
    if (this.secretBox && key.privateKeyHex) {
      key.privateKeyHex = await this.secretBox.decrypt(key.privateKeyHex)
    }
    return key as ManagedPrivateKey
  }

  async deleteKey({ alias }: { alias: string }) {
    const key = await this.d1DBConnection
      .prepare('SELECT * FROM `private-keys` WHERE alias = ?')
      .bind(alias)
      .first<PrivateKey>()
    if (!key) throw Error(`not_found: Private Key data not found for alias=${alias}`)
    debug('Deleting private key data', alias)
    await this.d1DBConnection
      .prepare('DELETE FROM `private-keys` WHERE alias = ?')
      .bind(alias)
      .run()
    return true
  }

  async importKey(args: ImportablePrivateKey): Promise<ManagedPrivateKey> {
    const key = {
      alias: args.alias || uuid4(),
      privateKeyHex: args.privateKeyHex,
      type: args.type,
    } as PrivateKey
    debug('Saving private key data', args.alias)
    const existingKey = await this.d1DBConnection
      .prepare('SELECT * FROM `private-keys` WHERE alias = ?')
      .bind(key.alias)
      .first<PrivateKey>()
    if (existingKey && this.secretBox) {
      existingKey.privateKeyHex = await this.secretBox.decrypt(existingKey.privateKeyHex)
    }
    if (existingKey && existingKey.privateKeyHex !== key.privateKeyHex) {
      throw new Error(
        `key_already_exists: A key with this alias exists but with different data. Please use a different alias.`
      )
    }
    if (this.secretBox && key.privateKeyHex) {
      key.privateKeyHex = await this.secretBox.encrypt(key.privateKeyHex)
    }
    await this.d1DBConnection
      .prepare(
        'INSERT INTO `private-keys` (alias, privateKeyHex, type) VALUES (?, ?, ?) ON CONFLICT(alias) DO UPDATE SET privateKeyHex=excluded.privateKeyHex, type=excluded.type'
      )
      .bind(key.alias, key.privateKeyHex, key.type)
      .run()
    return key
  }

  async listKeys(): Promise<Array<ManagedPrivateKey>> {
    let keys = await this.d1DBConnection.prepare('SELECT * FROM `private-keys`').all<PrivateKey>()
    if (this.secretBox) {
      for (const key of keys.results) {
        key.privateKeyHex = (await this.secretBox?.decrypt(key.privateKeyHex)) as string
      }
    }
    return keys.results
  }
}
