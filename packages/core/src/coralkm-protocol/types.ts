import { CORALKM_PROTOCOL_PREFIX } from './coralkm-constants'
import type { ICoralKMGuardianStore, ICoralKMNamespaceStore } from './stores'

/**
 * Allowed roles in the CoralKM Protocol
 *
 * - wallet: An end-user wallet that requests key management services.
 * - gateway: A gateway service that facilitates communication between wallets and guardians.
 * - guardian: A trusted entity that provides key management services to wallets.
 *
 * Agents can assume one or more roles in the protocol.
 */
export type CoralKMRoles = 'wallet' | 'gateway' | 'guardian'

/**
 * Options for configuring the CoralKM Protocol Handler
 */
export interface CoralKMOptions {
  /**
   * The role(s) of the agent in the CoralKM protocol.
   */
  roles: CoralKMRoles[]
  /**
   * Implementation of the CoralKM Namespace Store.
   * Required if the agent has the 'gateway' role.
   */
  namespaceStore?: ICoralKMNamespaceStore
  /**
   * Implementation of the CoralKM Guardian Store.
   * Required if the agent has the 'guardian' role.
   */
  guardianStore?: ICoralKMGuardianStore
}

/**
 * Can be "ALLOW" or "DENY" and is used to determine whether a request for a specific {@link RequesterDid} should be ALLOW or DENY.
 */
export type PreRequestPolicy = 'ALLOW' | 'DENY'

/**
 * Can be "GRANTED" or "DENIED" and is used to record whether a request response for a specific {@link RequesterDid} has been granted or denied.
 */
export type RequestPolicy = 'GRANTED' | 'DENIED'

/**
 * Namespace structure used in CoralKM Protocol
 */
export interface INamespace {
  /**
   * The unique identifier of the namespace (UUID) for the wallet gateway.
   */
  id: string
  /**
   * The gateway DID associated with the namespace.
   */
  gateway_did: string
}

/**
 * Structure for Verification Challenge used in Guardian Verification
 */
export interface IVerificationChallenge {
  /**
   * The unique identifier of the challenge (UUID).
   */
  id: string
  /**
   * The type of challenge, this list needs fleshing out as we add more challenge types
   * and may change the structure of the interface accordingly.
   */
  type: 'question' | 'code'
  /**
   * Instructions for user to complete the challenge.
   */
  instructions: string
}

/**
 * CoralKM V0.1 Protocol Message Types
 */
export enum CoralKMV01MessageTypes {
  NAMESPACE_REQUEST = `${CORALKM_PROTOCOL_PREFIX}/namespace-request`,
  NAMESPACE_GRANT = `${CORALKM_PROTOCOL_PREFIX}/namespace-grant`,
  NAMESPACE_DENY = `${CORALKM_PROTOCOL_PREFIX}/namespace-deny`,
  NAMESPACE_SYNC = `${CORALKM_PROTOCOL_PREFIX}/namespace-sync`,
  NAMESPACE_SYNC_RESPONSE = `${CORALKM_PROTOCOL_PREFIX}/namespace-sync-response`,
  NAMESPACE_RECOVERY_REQUEST = `${CORALKM_PROTOCOL_PREFIX}/namespace-recovery-request`,
  GUARDIAN_REQUEST = `${CORALKM_PROTOCOL_PREFIX}/guardian-request`,
  GUARDIAN_GRANT = `${CORALKM_PROTOCOL_PREFIX}/guardian-grant`,
  GUARDIAN_DENY = `${CORALKM_PROTOCOL_PREFIX}/guardian-deny`,
  GUARDIAN_REMOVE = `${CORALKM_PROTOCOL_PREFIX}/guardian-remove`,
  GUARDIAN_REMOVE_CONFIRM = `${CORALKM_PROTOCOL_PREFIX}/guardian-remove-confirm`,
  GUARDIAN_SHARE_UPDATE = `${CORALKM_PROTOCOL_PREFIX}/guardian-share-update`,
  GUARDIAN_SHARE_UPDATE_CONFIRM = `${CORALKM_PROTOCOL_PREFIX}/guardian-share-update-confirm`,
  GUARDIAN_VERIFICATION_CHALLENGE = `${CORALKM_PROTOCOL_PREFIX}/guardian-verification-challenge`,
  GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE = `${CORALKM_PROTOCOL_PREFIX}/guardian-verification-challenge-response`,
  GUARDIAN_RELEASE_SHARE = `${CORALKM_PROTOCOL_PREFIX}/guardian-release-share`,
}

/**
 * Arguments for creating a Namespace Request message
 */
export interface NamespaceRequestArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_REQUEST
  from: string
  to: string
}

/**
 * Arguments for creating a Namespace Request Grant message
 */
export interface NamespaceRequestGrantArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_GRANT
  from: string
  to: string
  thid: string
  /**
   * The namespace being granted by the wallet gateway.
   */
  namespace: INamespace
}

/**
 * Arguments for creating a Namespace Request Deny message
 */
export interface NamespaceRequestDenyArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_DENY
  from: string
  to: string
  thid: string
  /**
   * (Optional) The reason for denying the namespace request.
   */
  reason?: string
}

/**
 * Arguments for creating a Namespace Sync message to backup or restore wallet data
 */

/**
 * Arguments for creating a Namespace Sync PUT Request to backup the wallet data
 */
interface NamespaceSyncPutArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_SYNC
  from: string
  to: string
  request: 'PUT'
  /**
   * Base64 encrypted wallet backup data associated with the namespace.
   */
  data: string
}

/**
 * Arguments for creating a Namespace Sync GET Request to restore the wallet data
 */
interface NamespaceSyncGetArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_SYNC
  from: string
  to: string
  request: 'GET'
  /**
   * (Optional) If provided, indicates a specific recovery ID namespace to restore data for.
   * TODO: For now, just use the namespace ID, but in future need to think about how to do this securely
   * so only authorized wallets can access and restore the backup data after recovery.
   */
  recovery_id?: string
}

/**
 * Arguments for creating a Namespace Sync message to backup or restore wallet data
 */
export type NamespaceSyncArgs = NamespaceSyncPutArgs | NamespaceSyncGetArgs

/**
 * Arguments for creating a Namespace Sync Response message
 */

/**
 * Arguments for creating a Namespace Sync PUT Response message
 */
interface NamespaceSyncPutResponseArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_SYNC_RESPONSE
  from: string
  to: string
  thid: string
  request: 'PUT'
  /**
   * SHA-256 hash of the synced data for integrity verification.
   */
  hash: string
}

/**
 * Arguments for creating a Namespace Sync GET Response message
 */
interface NamespaceSyncGetResponseArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_SYNC_RESPONSE
  from: string
  to: string
  thid: string
  request: 'GET'
  /**
   * Base64 encrypted wallet backup data associated with the namespace.
   */
  data: string
}

/**
 * Arguments for creating a Namespace Sync Response message
 */
export type NamespaceSyncResponseArgs = NamespaceSyncPutResponseArgs | NamespaceSyncGetResponseArgs

/**
 * Arguments for creating a Namespace Recovery Request message
 */
export interface NamespaceRecoveryRequestArgs {
  type: CoralKMV01MessageTypes.NAMESPACE_RECOVERY_REQUEST
  from: string
  to: string
  /**
   * The device DID requesting the namespace recovery which will include the devices ephemeral encryption keys
   * for secure communication during the recovery process.
   */
  device_did: string
  /**
   * The namespace for the recovery request.
   */
  namespace: INamespace
  /**
   * Optionally set the unique identifier for the recovery request.
   * @default a new UUID will be generated
   */
  request_id?: string
  /**
   * Optionally set the date the recovery request expires.
   * @default 24 hours from creation
   */
  expires_at?: Date
}

/**
 * Arguments for creating a Guardian Request message
 */
export interface GuardianRequestArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_REQUEST
  from: string
  to: string
}

/**
 * Arguments for creating a Guardian Request Grant message
 */
export interface GuardianRequestGrantArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_GRANT
  from: string
  to: string
  thid: string
}

/**
 * Arguments for creating a Guardian Request Deny message
 */
export interface GuardianRequestDenyArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_DENY
  from: string
  to: string
  thid: string
  /**
   * (Optional) The reason for denying the guardian request.
   */
  reason?: string
}

/**
 * Arguments for creating a Guardian Remove message
 */
export interface GuardianRemoveArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_REMOVE
  from: string
  to: string
}

/**
 * Arguments for creating a Guardian Remove Confirm message
 */
export interface GuardianRemoveConfirmArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_REMOVE_CONFIRM
  from: string
  to: string
  thid: string
}

/**
 * Arguments for creating a Guardian Share Update message
 */
export interface GuardianShareUpdateArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE
  from: string
  to: string
  namespace: INamespace
  /**
   * Threshold number of guardian shares required for recovery.
   */
  threshold: number
  /**
   * Delay in seconds before the guardian can release their share after successful verification.
   * Optional; if not provided, no delay is enforced.
   */
  delay?: number
  /**
   * Base64 encoded guardian share data
   */
  share: string
}

/**
 * Arguments for creating a Guardian Share Update Confirm message
 */
export interface GuardianShareUpdateConfirmArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE_CONFIRM
  from: string
  to: string
  thid: string
}

/**
 * Arguments for creating a Guardian Verification Challenge message
 */
export interface GuardianVerificationChallengeArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE
  from: string
  to: string
  pthid: string
  challenge: IVerificationChallenge
}

/**
 * Arguments for creating a Guardian Verification Challenge Response message
 */
export interface GuardianVerificationChallengeResponseArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE
  from: string
  to: string
  pthid: string
  thid: string
  challenge_id: string
  response: string
}

/**
 * Arguments for creating a Guardian Release Share message
 */
export interface GuardianReleaseShareArgs {
  type: CoralKMV01MessageTypes.GUARDIAN_RELEASE_SHARE
  from: string
  to: string
  pthid: string
  threshold: number
  /**
   * Base64 encoded guardian share data being released
   */
  share: string
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../didcomm-protocols/didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [CoralKMV01MessageTypes.NAMESPACE_REQUEST]: NamespaceRequestArgs
    [CoralKMV01MessageTypes.NAMESPACE_GRANT]: NamespaceRequestGrantArgs
    [CoralKMV01MessageTypes.NAMESPACE_DENY]: NamespaceRequestDenyArgs
    [CoralKMV01MessageTypes.NAMESPACE_SYNC]: NamespaceSyncArgs
    [CoralKMV01MessageTypes.NAMESPACE_SYNC_RESPONSE]: NamespaceSyncResponseArgs
    [CoralKMV01MessageTypes.NAMESPACE_RECOVERY_REQUEST]: NamespaceRecoveryRequestArgs
    [CoralKMV01MessageTypes.GUARDIAN_REQUEST]: GuardianRequestArgs
    [CoralKMV01MessageTypes.GUARDIAN_GRANT]: GuardianRequestGrantArgs
    [CoralKMV01MessageTypes.GUARDIAN_DENY]: GuardianRequestDenyArgs
    [CoralKMV01MessageTypes.GUARDIAN_REMOVE]: GuardianRemoveArgs
    [CoralKMV01MessageTypes.GUARDIAN_REMOVE_CONFIRM]: GuardianRemoveConfirmArgs
    [CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE]: GuardianShareUpdateArgs
    [CoralKMV01MessageTypes.GUARDIAN_SHARE_UPDATE_CONFIRM]: GuardianShareUpdateConfirmArgs
    [CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE]: GuardianVerificationChallengeArgs
    [CoralKMV01MessageTypes.GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE]: GuardianVerificationChallengeResponseArgs
    [CoralKMV01MessageTypes.GUARDIAN_RELEASE_SHARE]: GuardianReleaseShareArgs
  }
}
