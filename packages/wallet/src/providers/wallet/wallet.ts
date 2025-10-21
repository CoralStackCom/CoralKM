import type { IIdentifier } from '@veramo/core'
import type { IDIDCommMessage } from '@veramo/did-comm'
import type { AbstractPrivateKeyStore, ManagedPrivateKey } from '@veramo/key-manager'
import { MemoryPrivateKeyStore } from '@veramo/key-manager'
import type { DIDDocument } from 'did-resolver'

import type {
  DiscoveryFeatureDisclosure,
  IAgentUserProfile,
  ICoralKMGuardianStore,
  ICoralKMShare,
  INamespace,
  IUserProfileStore,
} from '@coralkm/core'
import {
  CoralKMV01MessageTypes,
  DiscoverFeaturesV2MessageTypes,
  MemoryGuardianStore,
  MemoryUserProfileStore,
  UserProfileV1MessageTypes,
} from '@coralkm/core'

import { userProfiles } from '../../lib/user-profiles'
import type { AppAgent } from './agent'
import { createVeramoAgent } from './agent'
import { EncryptionManager } from './encryption'
import { ObservableStore } from './observable-store'
import { WebSocketConnection } from './websocket-connection'

/**
 *  Wallet User Information
 */
export interface IWalletUser {
  mediator_id: string
  mediator_did: DIDDocument
  routing_id?: string
  routing_did?: DIDDocument
  displayName: string
  displayPicture?: string
}

/**
 * A message stored in a DIDComm channel with optional decoded content
 */
export interface IChannelMessage {
  message: IDIDCommMessage
  timestamp: string
  is_sent: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decoded?: any
}

/**
 * A simple representation of a DIDComm channel with a DID and message history
 */
export interface IChannel {
  id: string
  did: DIDDocument
  profile: IAgentUserProfile
  messages: IChannelMessage[]
  features?: DiscoveryFeatureDisclosure[]
  routing_did?: string
  supports_guardian: boolean
  is_guardian: boolean
}

/**
 * Exported wallet data structure for backup or transfer
 */
export interface WalletExportedData {
  identifiers: IIdentifier[]
  keys: ManagedPrivateKey[]
  shares: ICoralKMShare[]
}

/**
 * Snapshot of the current wallet state for React.useSyncExternalStore()
 */
export interface WalletSnapshot {
  version: number
  user?: IWalletUser
  channels: Map<string, IChannel>
  namespace?: INamespace
  walletKey?: string
  backupData?: WalletExportedData
  // Holds the restored data after recovery is complete
  restoredData?: {
    key: string
    data: WalletExportedData
    namespace: INamespace
  }
}

/**
 * Imoplementation of an in-memory Wallet that uses Veramo agent and WebSocket connection
 * to connect to a wallet gateway.
 */
export class Wallet extends ObservableStore<WalletSnapshot> {
  private _gatewayDID: string
  private _agent: AppAgent
  private _wsConnection: WebSocketConnection
  private _walletUser?: IWalletUser
  private _namespace?: INamespace
  private _channels: Map<string, IChannel> = new Map()
  private _isInitialized: boolean = false
  private _walletKey?: {
    key: CryptoKey
    encoded: string
  }
  private _backupData?: WalletExportedData
  // Holds the restored data after recovery is complete
  private _restoredData?: {
    key: string
    data: WalletExportedData
    namespace: INamespace
  }

  // Current recovery process state
  private _currentRecovery: {
    // Id of the recovery request for correlation
    id: string
    // The namespace being recovered
    namespace: INamespace
    // Array of received shares
    shares: string[]
  } | null = null

  // Initialise agent protocol stores
  private _keyStore: AbstractPrivateKeyStore = new MemoryPrivateKeyStore()
  private _guardianStore: ICoralKMGuardianStore = new MemoryGuardianStore()
  private _userProfileStore: IUserProfileStore = new MemoryUserProfileStore()

  /**
   * Create a new Wallet instance
   *
   * @param gatewayDID The DID of the wallet gateway to connect to
   */
  constructor(gatewayDID: string) {
    super()
    this._gatewayDID = gatewayDID
    this._agent = createVeramoAgent({
      privateKeyStore: this._keyStore,
      guardianStore: this._guardianStore,
      userProfileStore: this._userProfileStore,
    })
    this._wsConnection = new WebSocketConnection({
      agent: this._agent,
      mediatorDID: this._gatewayDID,
      onMessage: this._onMessage.bind(this),
    })
  }

  /**
   * Implementation of getSnapshot for ObservableStore
   * @returns WalletSnapshot
   */
  getSnapshot(): WalletSnapshot {
    if (this._cached_snapshot && this._cached_snapshot.version === this._version) {
      return this._cached_snapshot
    }
    this._cached_snapshot = {
      version: this._version,
      user: this._walletUser,
      channels: this._channels,
      namespace: this._namespace,
      walletKey: this._walletKey?.encoded,
      backupData: this._backupData,
      restoredData: this._restoredData,
    }
    return this._cached_snapshot
  }

  /**
   * Get the current wallet user information
   */
  get walletUser(): IWalletUser | undefined {
    return this._walletUser
  }

  /**
   * Get the current channels map
   */
  get channels(): Map<string, IChannel> {
    return this._channels
  }

  /**
   * Get the current namespace ID
   */
  get namespace(): INamespace | undefined {
    return this._namespace
  }

  /**
   * Initialize the wallet by connecting to the gateway
   */
  async init() {
    if (this._isInitialized) {
      return
    }
    this._isInitialized = true
    console.log('Initializing wallet...')
    // Add mediator channel
    await this._addChannel(this._gatewayDID)

    // Connect to gateway via WebSocket
    const dids = await this._wsConnection.connect()
    const clientDIDdoc = await this._agent.resolveDid({ didUrl: dids.clientDID })
    const routingDIDdoc = await this._agent.resolveDid({ didUrl: dids.routingDID })
    this._userProfileStore.setProfile('*', {
      displayName: userProfiles[0].displayName,
      displayPicture: userProfiles[0].displayPicture,
      description: 'A user of the CoralKM wallet',
    })
    this._walletUser = {
      mediator_id: dids.clientDID,
      mediator_did: clientDIDdoc.didDocument as DIDDocument,
      routing_id: dids.routingDID,
      routing_did: routingDIDdoc.didDocument as DIDDocument,
      displayName: userProfiles[0].displayName,
      displayPicture: userProfiles[0].displayPicture,
    }

    // Setup mediator channel
    await this._setupChannel(this._gatewayDID)

    // Create new namespace on Wallet Gateway for user
    const nsRequest = await this._agent.createProtocolMessage({
      type: CoralKMV01MessageTypes.NAMESPACE_REQUEST,
      to: this._gatewayDID,
      from: this._walletUser.mediator_id,
    })
    const nsResponse = await this._wsConnection.invoke(nsRequest)
    this._namespace = nsResponse.decoded as INamespace

    // Generate a new wallet encryption key
    const dek = await EncryptionManager.createDEK()
    const encodedDEK = await EncryptionManager.exportDEK(dek)
    this._walletKey = { key: dek, encoded: encodedDEK }
    await this.syncWallet()

    this._notify()
  }

  /**
   * Update the wallet user's profile and broadcast to all channels
   *
   * @param profile The new user profile information
   */
  async updateUserProfile(profile: IAgentUserProfile) {
    if (this._walletUser) {
      this._walletUser.displayName = profile.displayName
      this._walletUser.displayPicture = profile.displayPicture
      this._userProfileStore.setProfile('*', {
        displayName: profile.displayName,
        displayPicture: profile.displayPicture,
        description: profile.description,
      })
      this._notify()

      // Broadcast updated profile to all channels
      if (this._wsConnection.isOpen) {
        this._channels.forEach(async channel => {
          const profileMessage = await this._agent.createProtocolMessage({
            type: UserProfileV1MessageTypes.PROFILE,
            to: channel.id,
            from:
              channel.id === this._gatewayDID
                ? (this._walletUser?.mediator_id as string)
                : (this._walletUser?.routing_id as string),
            profile: {
              displayName: profile.displayName,
              displayPicture: profile.displayPicture,
            },
            send_back_yours: false,
          })
          await this._wsConnection.send(profileMessage)
        })
      }
    }
  }

  /**
   * Rotate the wallet keys and DIDs
   */
  async rotateKeys() {
    console.log('Rotating current user keys and DIDs...')
  }

  /**
   * Add a new channel by DID and setup
   *
   * @param did The DID of the new channel
   * @returns   The created channel
   */
  async addChannel(did: string): Promise<IChannel> {
    await this._setupChannel(did)
    return this._channels.get(did)!
  }

  /**
   * Send an asynchronous DIDComm message via the WebSocket connection
   *
   * @param message The DIDComm message to send
   */
  async sendMessage(message: IDIDCommMessage) {
    await this._wsConnection.send(message)
  }

  /**
   * Sync the wallet state with the gateway using the Data Encryption Key. Exports all Veramo agent identifiers
   * and keys to a JSON object.
   *
   * This includes:
   * - Each identifier (DID, provider, alias, controllerKeyId)
   * - Each key (private + public parts)
   */
  async syncWallet() {
    console.log('Syncing wallet with gateway...')
    // 1. Get all identifiers
    const identifiers = await this._agent.didManagerFind()
    // 2. Get all keys
    const keys: ManagedPrivateKey[] = await this._keyStore.listKeys({})
    // 3. Get all guardian shares
    const shares: ICoralKMShare[] = await this._guardianStore.listShares()

    this._backupData = {
      identifiers,
      keys,
      shares,
    }

    const encryptedData = await EncryptionManager.encrypt(
      this._walletKey!.key,
      this._backupData,
      this._namespace || 'default'
    )

    // 4. Send to gateway
    const syncRequest = await this._agent.createProtocolMessage({
      type: CoralKMV01MessageTypes.NAMESPACE_SYNC,
      to: this._gatewayDID,
      from: this._walletUser!.mediator_id,
      request: 'PUT',
      data: encryptedData,
    })
    const response = await this._wsConnection.invoke(syncRequest)
    const remoteHash = response.decoded as { request: 'PUT'; hash: string }
    const localHash = await this._sha256Data(encryptedData)
    console.log('Sync Finished! Hashes:', { remoteHash: remoteHash.hash, localHash })

    this._notify()
  }

  /**
   * Add a guardian by DID
   *
   * @param guardianDid The DID of the guardian to add
   */
  async addGuardian(gurdianDid: string) {
    console.log('Adding guardian:', gurdianDid)
    let requestGranted = false
    const requestMessage = await this._agent.createProtocolMessage({
      type: CoralKMV01MessageTypes.GUARDIAN_REQUEST,
      to: gurdianDid,
      from:
        gurdianDid === this._gatewayDID
          ? this._walletUser!.mediator_id
          : (this._walletUser!.routing_id as string),
    })
    const response = await this._wsConnection.invoke(requestMessage)
    if (response.message.type === CoralKMV01MessageTypes.GUARDIAN_GRANT) {
      this._channels.get(gurdianDid)!.is_guardian = true
      requestGranted = true
    } else {
      this._channels.get(gurdianDid)!.is_guardian = false
    }
    this._notify()

    if (requestGranted) {
      await this._updateGuardianShares()
    }
    this._notify()
  }

  /**
   * Remove a guardian by DID
   *
   * @param guardianDid The DID of the guardian to remove
   */
  async removeGuardian(guardianDid: string) {
    console.log('Removing guardian:', guardianDid)
    const removeMessage = await this._agent.createProtocolMessage({
      type: CoralKMV01MessageTypes.GUARDIAN_REMOVE,
      to: guardianDid,
      from:
        guardianDid === this._gatewayDID
          ? this._walletUser!.mediator_id
          : (this._walletUser!.routing_id as string),
    })
    const response = await this._wsConnection.invoke(removeMessage)
    if (response.message.type === CoralKMV01MessageTypes.GUARDIAN_REMOVE_CONFIRM) {
      this._channels.get(guardianDid)!.is_guardian = false
      console.log('Guardian removed:', guardianDid)
      await this._updateGuardianShares()
    }
    this._notify()
  }

  /**
   * Initiate wallet recovery using a provided namespace object
   *
   * @param namespace The namespace object to recover the wallet
   */
  async recoverWallet(namespace: INamespace) {
    // Implementation for wallet recovery using the provided namespace
    console.log('Recovering wallet with namespace:', namespace)

    // Send recovery request to gateway
    const recoveryRequest = await this._agent.createProtocolMessage({
      type: CoralKMV01MessageTypes.NAMESPACE_RECOVERY_REQUEST,
      to: this._gatewayDID,
      from: this._walletUser!.routing_id as string,
      device_did: this._walletUser!.routing_id as string,
      namespace,
    })

    // Initialize current recovery state
    this._currentRecovery = {
      id: recoveryRequest.id,
      namespace,
      shares: [],
    }

    // Send recovery request to gateway which will broadcast to guardians anonymously
    await this._wsConnection.send(recoveryRequest)
  }

  /**
   * Update guardian shares after changes in guardianship
   */
  private async _updateGuardianShares() {
    // Resplit secrets and send shares to guardians
    console.log('Guardian request granted, resplitting secrets...')
    const totalShares = Array.from(this._channels.values()).reduce((acc, channel) => {
      if (channel.is_guardian) {
        return acc + 1
      }
      return acc
    }, 0)

    if (totalShares < 2) {
      console.log('Require at least 2 guardians, skipping share distribution.')
      return
    }

    const threshold = Math.max(2, Math.ceil(totalShares / 2))
    const dekShares = await EncryptionManager.splitDEK(this._walletKey!.key, totalShares, threshold)
    console.log('Generated DEK shares for guardians:', { totalShares, threshold, dekShares })
    Array.from(this._channels.values()).forEach(async (channel, index) => {
      if (channel.is_guardian) {
        const shareMessage = await this._agent.createProtocolMessage({
          type: CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE,
          to: channel.id,
          from:
            channel.id === this._gatewayDID
              ? this._walletUser!.mediator_id
              : (this._walletUser!.routing_id as string),
          namespace: this._namespace!,
          threshold,
          share: dekShares[index],
        })
        const shareResponse = await this._wsConnection.invoke(shareMessage)
        console.log('Sent share to guardian:', channel.id, shareResponse)
      }
    })
  }

  /**
   * Handle incoming and outgoing DIDComm messages from the websocket connection
   *
   * @param message The DIDComm Message being sent or received
   * @param isSent  Whether the message was sent or received
   * @param decoded Any decoded payload
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async _onMessage(message: IDIDCommMessage, isSent: boolean, decoded?: any) {
    console.debug('Wallet received message:', message, isSent, decoded)
    const channelId =
      (isSent ? (message.to?.[0] as string | undefined) : (message.from as string | undefined)) ??
      'recovery-requests'

    // Add new channel if incoming message from unknown DID
    if (
      !isSent &&
      channelId &&
      channelId !== 'recovery-requests' &&
      !this._channels.has(channelId)
    ) {
      await this._addChannel(channelId)
      await this._setupChannel(channelId)
    } else if (!isSent && channelId === 'recovery-requests' && !this._channels.has(channelId)) {
      // Add a special recovery requests channel for broadcast messages
      const channel: IChannel = {
        id: channelId,
        did: {} as DIDDocument,
        profile: { displayName: 'Recovery Requests' },
        supports_guardian: false,
        is_guardian: false,
        messages: [],
      }
      this._channels.set(channelId, channel)
      this._notify()
    }

    // Append message to channel
    this._channels.get(channelId)!.messages.push({
      message,
      timestamp: new Date().toISOString(),
      is_sent: isSent,
      decoded,
    })

    // Handle special messages if needed
    if (!isSent) {
      // Handle user profile message
      if (message.type === UserProfileV1MessageTypes.PROFILE) {
        console.debug(`Received User Profile message from : ${message.from}`, decoded)
        this._channels.get(channelId)!.profile = decoded as IAgentUserProfile
      } else if (message.type === CoralKMV01MessageTypes.GUARDIAN_GRANT) {
        console.debug(`Received Guardianship Grant from : ${message.from}`)
        this._channels.get(channelId)!.is_guardian = true
      } else if (message.type === CoralKMV01MessageTypes.GUARDIAN_DENY) {
        console.debug(`Received Guardianship Deny from : ${message.from}`)
        this._channels.get(channelId)!.is_guardian = false
      } else if (message.type === CoralKMV01MessageTypes.GUARDIAN_REMOVE_CONFIRM) {
        console.debug(`Received Guardianship Remove Confirm from : ${message.from}`)
        this._channels.get(channelId)!.is_guardian = false
      } else if (message.type === CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE) {
        console.debug(`Received Guardian Share Update Confirm from : ${message.from}`)
        // Sync wallet
        await this.syncWallet()
      } else if (message.type === CoralKMV01MessageTypes.GUARDIAN_REMOVE) {
        console.debug(`Received Guardian Remove from : ${message.from}`)
        // Sync wallet
        await this.syncWallet()
      } else if (message.type === CoralKMV01MessageTypes.GUARDIAN_RELEASE_SHARE) {
        console.debug(`Received Recovery Share from : ${message.from}`, decoded)
        // Handle recovery share
        if (this._currentRecovery) {
          this._currentRecovery.shares.push(decoded.share as string)
          if (this._currentRecovery.shares.length >= decoded.threshold) {
            await this._restoreWallet()
            this._currentRecovery = null
          }
        }
      }
    }

    this._notify()
  }

  /**
   * Add a new channel by its DID ID
   *
   * @param id  The channel ID (DID)
   * @returns   The created channel
   */
  private async _addChannel(id: string): Promise<IChannel> {
    if (this._channels.has(id)) {
      throw new Error(`Channel with ID ${id} already exists`)
    }
    // Add channel
    const didDoc = await this._agent.resolveDid({ didUrl: id })
    const channel: IChannel = {
      id,
      did: didDoc.didDocument as DIDDocument,
      profile: { displayName: id },
      supports_guardian: false,
      is_guardian: false,
      messages: [],
    }
    this._channels.set(id, channel)
    this._notify()
    return channel
  }

  /**
   * Setup a channel by its ID, adding it if it doesn't exist and requesting features/profile
   *
   * @param id The channel ID (DID)
   */
  private async _setupChannel(id: string) {
    if (!this._channels.has(id)) {
      // Add channel if it doesn't exist
      await this._addChannel(id)
    }
    if (!this._walletUser) {
      throw new Error('Wallet user not initialized')
    }

    // Discover features
    const discoveryQueryRequest = await this._agent.createProtocolMessage({
      type: DiscoverFeaturesV2MessageTypes.QUERIES_REQUEST,
      to: id,
      from: this._walletUser?.routing_id || this._walletUser?.mediator_id,
    })
    const discoveryQueryResponse = await this._wsConnection.invoke(discoveryQueryRequest)
    this._channels.get(id)!.features =
      discoveryQueryResponse.decoded as DiscoveryFeatureDisclosure[]

    // Check if guardian support is indicated in features
    ;(discoveryQueryResponse.decoded as DiscoveryFeatureDisclosure[]).forEach(f => {
      if (f.id === 'https://coralstack.com/coralkm/0.1') {
        // Set guardian support flag
        this._channels.get(id)!.supports_guardian = true
      }
    })

    // Request user profile
    const userProfileRequest = await this._agent.createProtocolMessage({
      type: UserProfileV1MessageTypes.REQUEST_PROFILE,
      to: id,
      from: this._walletUser?.routing_id || this._walletUser?.mediator_id,
    })
    // Bug in DIDComm plugin as protocol uses pthid which isn't read by Veramo DIDComm MessageHandler
    await this._wsConnection.send(userProfileRequest)

    this._notify()
  }

  /**
   * Restore the wallet from backup data
   */
  private async _restoreWallet() {
    console.log('Received sufficient shares, restoring wallet...')

    if (!this._currentRecovery) {
      throw new Error('No current recovery in progress')
    }
    const { namespace, shares } = this._currentRecovery

    // Reconstruct DEK from shares
    const reconstructedDEK = await EncryptionManager.combineDEK(shares)
    console.log(
      `Reconstructed DEK from shares: ${await EncryptionManager.exportDEK(reconstructedDEK)}`
    )

    // Restore backup data from gateway
    const syncRequest = await this._agent.createProtocolMessage({
      type: CoralKMV01MessageTypes.NAMESPACE_SYNC,
      to: this._gatewayDID,
      from: this._walletUser!.mediator_id,
      request: 'GET',
      recovery_id: namespace.id,
    })
    const response = await this._wsConnection.invoke(syncRequest)
    const remoteBackup = response.decoded as { request: 'GET'; data: string }
    const decryptedData = (await EncryptionManager.decrypt(
      reconstructedDEK,
      remoteBackup.data,
      namespace
    )) as WalletExportedData
    this._restoredData = {
      key: await EncryptionManager.exportDEK(reconstructedDEK),
      data: decryptedData,
      namespace,
    }
    this._notify()
    console.log('SUCCESS - Restored wallet from backup!!', { data: decryptedData })
  }

  /**
   * Simplified MD5 hashing function for data integrity checks
   *
   * @param data  The encrypted data string to hash
   * @returns     The SHA-256 hash as a hexadecimal string
   */
  private async _sha256Data(data: string): Promise<string> {
    // Get SHA-256 hash of the data
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }
}
