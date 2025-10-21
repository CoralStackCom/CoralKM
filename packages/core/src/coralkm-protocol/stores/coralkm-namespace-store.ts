import { RequestPolicy } from '../types'

/**
 * Interface representing a Namespace Policy
 */
export interface ICoralKMNamespacePolicy {
  /**
   * The DID of the requester.
   */
  requesterDid: string
  /**
   * The policy status for the requester DID.
   * Can be "GRANTED" or "DENIED".
   */
  status: RequestPolicy
}

/**
 * Interface representing a Namespace
 */
export interface ICoralKMNamespace {
  /**
   * The unique identifier of the namespace.
   */
  id: string
  /**
   * The decentralized identifier of the namespace owner.
   */
  ownerDid: string
  /**
   * The DID of the wallet gateway hosting the namespace.
   */
  gatewayDid: string
  /**
   * The date the namespace was created.
   */
  createdAt: Date
  /**
   * The date the namespace was last synced with the wallet backup data.
   */
  syncedAt: Date | null
  /**
   * Base64 encrypted wallet backup data associated with the namespace.
   */
  data: string | null
}

/**
 * Interface for CoralKM Namespace Store
 */
export interface ICoralKMNamespaceStore {
  /**
   * Get the Namespace policy for a specific requester DID.
   *
   * @param requesterDid  The DID of the requester.
   * @returns             The policy for the requester DID, or null if none exists.
   */
  getNamespacePolicy(requesterDid: string): Promise<ICoralKMNamespacePolicy | null>
  /**
   * Insert or update a Namespace policy for a specific requester DID.
   *
   * @param requesterDid  The DID of the requester.
   * @param policy        The policy to set for the requester DID.
   * @returns             The policy for the requester DID.
   */
  setNamespacePolicy(requesterDid: string, policy: RequestPolicy): Promise<ICoralKMNamespacePolicy>
  /**
   * Remove the Namespace policy for a specific requester DID.
   *
   * @param requesterDid The DID of the requester.
   * @returns            True if a policy was removed, false if none existed.
   */
  removeNamespacePolicy(requesterDid: string): Promise<boolean>
  /**
   * Creates a new namespace for the given owner DID.
   *
   * @param ownerDid  The decentralized identifier of the namespace owner.
   * @returns         The created namespace object.
   */
  createNamespace(ownerDid: string): Promise<ICoralKMNamespace>
  /**
   * Retrieves the namespace associated with the given owner DID.
   *
   * @param by      The identifier or owner DID of the namespace. At least one must be provided.
   *                If both are provided, id takes precedence.
   * @returns       The namespace object or null if not found.
   */
  getNamespace(by: { id: string } | { owner_did: string }): Promise<ICoralKMNamespace | null>
  /**
   * Updates the namespace ID associated with the given owner DID. Useful to protect
   * against correlation attacks by rotating namespace identifiers.
   *
   * @param id    The unique identifier of the namespace.
   * @returns     The updated namespace object with new ID.
   */
  updateNamespace(id: string): Promise<ICoralKMNamespace>
  /**
   * Saves the encrypted wallet backup data for the specified namespace owner DID.
   *
   * @param ownerDid  The decentralized identifier of the namespace owner.
   * @param data      The base64 encrypted wallet backup data to save.
   * @returns         The SHA-256 hash of the saved data for integrity verification.
   */
  saveNamespaceData(ownerDid: string, data: string): Promise<string>
  /**
   * Deletes the namespace with the specified ID.
   *
   * @param id The unique identifier of the namespace to delete.
   * @return   True if the namespace was deleted, false otherwise.
   */
  deleteNamespace(id: string): Promise<boolean>
}
