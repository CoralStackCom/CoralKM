import type {
  AuthorizedDIDContext,
  FindArgs,
  IAgentPlugin,
  IDataStore,
  IDataStoreDeleteMessageArgs,
  IDataStoreDeleteVerifiableCredentialArgs,
  IDataStoreGetMessageArgs,
  IDataStoreGetVerifiableCredentialArgs,
  IDataStoreGetVerifiablePresentationArgs,
  IDataStoreORM,
  IDataStoreSaveMessageArgs,
  IDataStoreSaveVerifiableCredentialArgs,
  IDataStoreSaveVerifiablePresentationArgs,
  IIdentifier,
  IMessage,
  TClaimsColumns,
  TCredentialColumns,
  TIdentifiersColumns,
  TMessageColumns,
  TPresentationColumns,
  UniqueVerifiableCredential,
  UniqueVerifiablePresentation,
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core-types'
import { schema } from '@veramo/core-types'
import { computeEntryHash } from '@veramo/utils'
import Debug from 'debug'

import type { Message } from './entities'
import { convertToMessageFromRow, convertToRowFromMessage } from './entities'
import { buildQ1Query } from './utils'

const debug = Debug('veramo:d1db:data-store')

/**
 * This class implements the {@link @veramo/core-types#IDataStore} interface using a Cloudflare D1 database.
 *
 * This allows you to store and retrieve Verifiable Credentials, Presentations and Messages by their IDs.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class D1DataStore implements IAgentPlugin {
  readonly methods: IDataStore & IDataStoreORM
  readonly schema = { ...schema.IDataStore, ...schema.IDataStoreORM }
  // Cloudflare D1 database connection
  private d1DBConnection: D1Database

  /**
   * Initialise the D1DIDStore with a D1 database connection.
   *
   * @param d1dbConnection A D1 database connection instance
   */
  constructor(d1dbConnection: D1Database) {
    this.d1DBConnection = d1dbConnection

    this.methods = {
      // IDataStore methods
      dataStoreSaveMessage: this.dataStoreSaveMessage.bind(this),
      dataStoreGetMessage: this.dataStoreGetMessage.bind(this),
      dataStoreDeleteMessage: this.dataStoreDeleteMessage.bind(this),
      dataStoreSaveVerifiableCredential: this.dataStoreSaveVerifiableCredential.bind(this),
      dataStoreGetVerifiableCredential: this.dataStoreGetVerifiableCredential.bind(this),
      dataStoreDeleteVerifiableCredential: this.dataStoreDeleteVerifiableCredential.bind(this),
      dataStoreSaveVerifiablePresentation: this.dataStoreSaveVerifiablePresentation.bind(this),
      dataStoreGetVerifiablePresentation: this.dataStoreGetVerifiablePresentation.bind(this),

      // IDataStoreORM methods
      dataStoreORMGetIdentifiers: this.dataStoreORMGetIdentifiers.bind(this),
      dataStoreORMGetIdentifiersCount: this.dataStoreORMGetIdentifiersCount.bind(this),
      dataStoreORMGetMessages: this.dataStoreORMGetMessages.bind(this),
      dataStoreORMGetMessagesCount: this.dataStoreORMGetMessagesCount.bind(this),
      dataStoreORMGetVerifiableCredentialsByClaims:
        this.dataStoreORMGetVerifiableCredentialsByClaims.bind(this),
      dataStoreORMGetVerifiableCredentialsByClaimsCount:
        this.dataStoreORMGetVerifiableCredentialsByClaimsCount.bind(this),
      dataStoreORMGetVerifiableCredentials: this.dataStoreORMGetVerifiableCredentials.bind(this),
      dataStoreORMGetVerifiableCredentialsCount:
        this.dataStoreORMGetVerifiableCredentialsCount.bind(this),
      dataStoreORMGetVerifiablePresentations:
        this.dataStoreORMGetVerifiablePresentations.bind(this),
      dataStoreORMGetVerifiablePresentationsCount:
        this.dataStoreORMGetVerifiablePresentationsCount.bind(this),
    }
  }

  // Messages

  async dataStoreSaveMessage(args: IDataStoreSaveMessageArgs): Promise<string> {
    const id = args.message?.id || computeEntryHash(args.message)
    const message = { ...args.message, id }
    const row = convertToRowFromMessage(message)
    debug('Saving Message', message.id, row)

    // Insert or update the message in the database
    await this.d1DBConnection
      .prepare(
        `INSERT INTO messages (id, type, createdAt, expiresAt, threadId, raw, data, replyTo, replyUrl, from, to, metaData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET type=excluded.type, createdAt=excluded.createdAt, expiresAt=excluded.expiresAt, threadId=excluded.threadId, raw=excluded.raw, data=excluded.data, replyTo=excluded.replyTo, replyUrl=excluded.replyUrl, from=excluded.from, to=excluded.to, metaData=excluded.metaData`
      )
      .bind(
        row.id,
        row.type,
        row.createdAt,
        row.expiresAt,
        row.threadId,
        row.raw,
        row.data,
        row.replyTo,
        row.replyUrl,
        row.from_id,
        row.to_id,
        row.metaData
      )
      .run()
    debug('Saved Message', message.id)
    return message.id
  }

  async dataStoreGetMessage(args: IDataStoreGetMessageArgs): Promise<IMessage> {
    const message = await this.d1DBConnection
      .prepare('SELECT * FROM messages WHERE id = ? LIMIT 1')
      .bind(args.id)
      .first<Message>()
    if (!message) {
      throw new Error(`Message with id ${args.id} not found`)
    }
    return convertToMessageFromRow(message)
  }

  async dataStoreDeleteMessage(args: IDataStoreDeleteMessageArgs): Promise<boolean> {
    const message = await this.d1DBConnection
      .prepare('SELECT * FROM messages WHERE id = ? LIMIT 1')
      .bind(args.id)
      .first<Message>()
    if (!message || typeof message === 'undefined') {
      return true
    }
    debug('Deleting Message', args.id)
    await this.d1DBConnection.prepare('DELETE FROM messages WHERE id = ?').bind(args.id).run()

    return true
  }

  async dataStoreORMGetMessages(
    args: FindArgs<TMessageColumns> & AuthorizedDIDContext
  ): Promise<IMessage[]> {
    const query = buildQ1Query<TMessageColumns>('SELECT * FROM messages', args)
    debug('dataStoreORMGetMessages Query:', query)
    const results = await this.d1DBConnection
      .prepare(query.sql)
      .bind(...query.params)
      .all<Message>()
    const messages: IMessage[] = []
    for (const row of results.results) {
      messages.push(convertToMessageFromRow(row as Message))
    }
    return messages
  }

  async dataStoreORMGetMessagesCount(
    args: FindArgs<TMessageColumns> & AuthorizedDIDContext
  ): Promise<number> {
    const query = buildQ1Query<TMessageColumns>('SELECT COUNT(*) as count FROM messages', args)
    debug('dataStoreORMGetMessagesCount Query:', query)
    // Get count of messages
    const result = await this.d1DBConnection
      .prepare(query.sql)
      .bind(...query.params)
      .first<{ count: number }>()
    return result?.count || 0
  }

  // Identifiers
  async dataStoreORMGetIdentifiers(
    _args: FindArgs<TIdentifiersColumns> & AuthorizedDIDContext
  ): Promise<IIdentifier[]> {
    throw new Error('Method not implemented.')
  }
  async dataStoreORMGetIdentifiersCount(
    _args: FindArgs<TIdentifiersColumns> & AuthorizedDIDContext
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }

  // Verifiable Credentials and Presentations

  async dataStoreSaveVerifiableCredential(
    _args: IDataStoreSaveVerifiableCredentialArgs
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }
  async dataStoreGetVerifiableCredential(
    _args: IDataStoreGetVerifiableCredentialArgs
  ): Promise<VerifiableCredential> {
    throw new Error('Method not implemented.')
  }
  async dataStoreDeleteVerifiableCredential(
    _args: IDataStoreDeleteVerifiableCredentialArgs
  ): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  async dataStoreSaveVerifiablePresentation(
    _args: IDataStoreSaveVerifiablePresentationArgs
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }
  async dataStoreGetVerifiablePresentation(
    _args: IDataStoreGetVerifiablePresentationArgs
  ): Promise<VerifiablePresentation> {
    throw new Error('Method not implemented.')
  }
  async dataStoreORMGetVerifiableCredentialsByClaims(
    _args: FindArgs<TClaimsColumns> & AuthorizedDIDContext
  ): Promise<UniqueVerifiableCredential[]> {
    throw new Error('Method not implemented.')
  }
  async dataStoreORMGetVerifiableCredentialsByClaimsCount(
    _args: FindArgs<TClaimsColumns> & AuthorizedDIDContext
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async dataStoreORMGetVerifiableCredentials(
    _args: FindArgs<TCredentialColumns> & AuthorizedDIDContext
  ): Promise<UniqueVerifiableCredential[]> {
    throw new Error('Method not implemented.')
  }
  async dataStoreORMGetVerifiableCredentialsCount(
    _args: FindArgs<TCredentialColumns> & AuthorizedDIDContext
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async dataStoreORMGetVerifiablePresentations(
    _args: FindArgs<TPresentationColumns> & AuthorizedDIDContext
  ): Promise<UniqueVerifiablePresentation[]> {
    throw new Error('Method not implemented.')
  }
  async dataStoreORMGetVerifiablePresentationsCount(
    _args: FindArgs<TPresentationColumns> & AuthorizedDIDContext
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }
}
