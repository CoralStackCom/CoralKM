import type { IAgentContext, IPluginMethodMap } from '@veramo/core-types'
import type { IDIDCommMessage } from '@veramo/did-comm'
import type { Message } from '@veramo/message-handler'

/**
 * Module augmentation to allow plugins to extend the ProtocolMessageRegistry
 * with their own protocol-specific message argument types.
 */
export interface ProtocolMessageRegistry {
  // This will be extended by plugins via module augmentation
}

/**
 * Union type of all registered protocol message argument types.
 */
export type IProtocolMessageArgs = ProtocolMessageRegistry[keyof ProtocolMessageRegistry]

/**
 * Custom error class for DIDComm protocol-related errors.
 */
export class DIDCommProtocolError extends Error {
  constructor(
    message: string,
    public code: string,
    public messageType: IDIDCommMessageType,
    public args?: string[]
  ) {
    super(message)
    this.name = 'DIDCommProtocolError'
  }
}

/**
 * DIDComm Protocol Interface
 *
 * All protocols implementing DIDComm should adhere to this interface. When messages
 * are sent or received, the appropriate protocol implementation can be selected
 * based on the protocol's PIURI and version to handle the message correctly.
 */
export interface IDIDCommProtocolHandler {
  /**
   * Human-readable display name of the protocol
   */
  name: string
  /**
   * The version of the protocol following semantic versioning (e.g., "1.0", "2.1").
   */
  version: string
  /**
   * The Protocol Identifier URI as per DIDComm specifications without the
   * version suffix or trailing slash (e.g., "https://didcomm.org/<protocol-name>").
   *
   * The PIURI should resolve to a human friendly documentation page about the protocol.
   * @example "https://didcomm.org/messaging"
   */
  piuri: string
  /**
   * The role(s) the current agent can assume within the protocol.
   */
  roles?: string[]
  /**
   * Optional description of the protocol
   */
  description?: string
  /**
   * Creates a new DIDComm message specific to this protocol.
   *
   * @param args - Protocol-specific arguments for creating a new message.
   */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage
  /**
   * Asynchronous handler for incoming DIDComm messages specific to this protocol.
   *
   * @param messageType         The structued message type containing piuri, version, and type.
   * @param message             The incoming DIDComm message to handle.
   * @param context             The agent context containing necessary plugins.
   * @returns                   Return any response message or null if no response is needed.
   * @throws                    {DIDCommProtocolError} If error processing message.
   */
  handle(
    messageType: IDIDCommMessageType,
    message: Message,
    context: IAgentContext<{}>
  ): Promise<IDIDCommMessage | null>
}

/**
 * DIDComm Protocol plugin interface for {@link @veramo/core#Agent}
 * Registers DIDComm protocols which can be used to send and receive DIDComm messages.
 */
export interface IDIDCommProtocols extends IPluginMethodMap {
  /**
   * Registers a new DIDComm protocol handler.
   *
   * @param protocol    The protocol handler to register.
   * @throws {Error}    If any of the provided protocol handlers are invalid or if there are duplicates.
   */
  registerDIDCommProtocol: (protocol: IDIDCommProtocolHandler) => Promise<void>
  /**
   * Unregisters a DIDComm protocol handler.
   *
   * @param args.piuri      The Protocol Identifier URI as per DIDComm specifications without the
   *                        version suffix or trailing slash (e.g., "https://didcomm.org/<protocol-name>").
   * @param args.version    The version of the protocol to unregister (e.g., "1.0", "2.1").
   * @throws {Error} If the specified protocol handler is not registered.
   */
  unregisterDIDCommProtocol: ({
    piuri,
    version,
  }: {
    piuri: string
    version: string
  }) => Promise<void>
  /**
   * Returns all registered DIDComm protocols.
   *
   * @returns - an array of all registered {@link IDIDCommProtocolHandler}s
   *
   * @beta This API may change without a BREAKING CHANGE notice.
   */
  listDIDCommProtocols: () => Promise<IDIDCommProtocolHandler[]>
  /**
   * Finds a registered DIDComm protocol handler based on the full message type.
   *
   * @param messageType The full message type string (e.g., "https://didcomm.org/messaging/2.0/text").
   * @returns           The corresponding DIDComm protocol handler if found.
   * @throws            {Error} If no protocol handler is found for the given message type.
   */
  getDIDCommProtocol: (messageType: string) => Promise<IDIDCommProtocolHandler>

  /**
   * Creates a new DIDComm message specific to a registered protocol.
   *
   * @param args  Protocol-specific arguments for creating a new message.
   * @returns     The created DIDComm message.
   * @throws     {Error} If no protocol handler is found for the given arguments.
   */
  createProtocolMessage: (args: IProtocolMessageArgs) => Promise<IDIDCommMessage>
}

/**
 * DIDComm Message Type Interface. Structure representing the components of a DIDComm message type.
 */
export interface IDIDCommMessageType {
  /**
   * The Protocol Identifier URI without version suffix or trailing slash.
   * @example "https://didcomm.org/messaging"
   */
  piuri: string
  /**
   * The version of the protocol.
   * @example "2.0"
   */
  version: string
  /**
   * The specific message type within the protocol.
   * @example "message"
   */
  type: string
}
