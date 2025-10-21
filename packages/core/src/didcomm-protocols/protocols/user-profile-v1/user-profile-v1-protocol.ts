import { IAgentContext } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import type { Message } from '@veramo/message-handler'
import Debug from 'debug'
import { v4 } from 'uuid'

import { DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE } from '../../dicomm-protocols-message-handler'
import type {
  IDIDCommMessageType,
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from '../../didcomm-protocols-interface'
import { assertMessageFieldDefined, throwUnsupportedMessageType } from '../../didcomm-utils'
import type { IAgentUserProfile } from './types'
import type { IUserProfileStore } from './user-profile-store'

const debug = Debug('veramo:did-comm:user-profile-protocol-handler')

type IContext = IAgentContext<IDIDCommProtocols & IDIDComm>

/**
 * User Profile V1 Protocol Message Types
 */
export enum UserProfileV1MessageTypes {
  REQUEST_PROFILE = 'https://didcomm.org/user-profile/1.0/request-profile',
  PROFILE = 'https://didcomm.org/user-profile/1.0/profile',
}

/**
 * Arguments to create a User Profile Request message
 */
export interface RequestProfileArgs {
  type: UserProfileV1MessageTypes.REQUEST_PROFILE
  from: string
  to: string
  query?: 'displayName' | 'displayPicture' | 'description'[]
}

/**
 * Arguments to create a Proile Response message
 */
export interface ProfileResponseArgs {
  type: UserProfileV1MessageTypes.PROFILE
  from: string
  to: string
  pthid?: string
  send_back_yours?: boolean
  profile: IAgentUserProfile
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../../didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [UserProfileV1MessageTypes.REQUEST_PROFILE]: RequestProfileArgs
    [UserProfileV1MessageTypes.PROFILE]: ProfileResponseArgs
  }
}

/**
 * Implementation of the User Profile V1.0 Protocol Handler
 * Reference: https://didcomm.org/user-profile/1.0
 */
export class DCUserProfileProtocolV1 implements IDIDCommProtocolHandler {
  name = 'User Profile'
  version = '1.0'
  piuri = 'https://didcomm.org/user-profile'
  description = 'Enables the sender and recipient to exchange user profile information.'

  // The local agent's profile to share with others
  private userProfileStore: IUserProfileStore

  /**
   * Creates an instance of the User Profile Protocol Handler with the given agent profile.
   *
   * @param store The profile information of this agent to be shared with others
   */
  constructor(store: IUserProfileStore) {
    this.userProfileStore = store
  }

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case UserProfileV1MessageTypes.REQUEST_PROFILE:
        return {
          type: UserProfileV1MessageTypes.REQUEST_PROFILE,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            query: args.query || ['displayName', 'displayPicture', 'description'],
          },
        }
      case UserProfileV1MessageTypes.PROFILE:
        const msg: IDIDCommMessage = {
          type: UserProfileV1MessageTypes.PROFILE,
          from: args.from,
          to: [args.to],
          id: v4(),
          body: {
            profile: {
              displayName: args.profile.displayName,
            },
            send_back_yours: args.send_back_yours || false,
          },
        }
        if (args.pthid) {
          msg.pthid = args.pthid
        }
        if (args.profile.displayPicture) {
          msg.body.profile.displayPicture = '#image1' // Refer to attachment
          msg.attachments = [
            {
              id: 'image1',
              media_type: 'image/png',
              filename: 'avatar.png',
              data: {
                base64: args.profile.displayPicture,
              },
            },
          ]
        }
        if (args.profile.description) {
          msg.body.profile.description = args.profile.description
        }
        return msg
      default:
        debug(`unsupported_message_type is not supported by User Profile v1.0:`, args)
        throw new Error('unsupported_message_type is not supported by User Profile v1.0')
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.handle} */
  async handle(
    messageType: IDIDCommMessageType,
    message: Message,
    _context: IContext
  ): Promise<IDIDCommMessage | null> {
    switch (messageType.type) {
      case 'request-profile':
        debug('Handling User Profile request message:', message)
        const { from, to, id } = message
        assertMessageFieldDefined(from, 'from', messageType)
        assertMessageFieldDefined(to, 'to', messageType)
        return this.createMessage({
          type: UserProfileV1MessageTypes.PROFILE,
          from: to,
          to: from,
          pthid: id,
          send_back_yours: true,
          profile: await this.userProfileStore.getProfile(to),
        })
      case 'profile':
        debug('Handling User Profile response message:', message)

        const userProfile: IAgentUserProfile = {
          displayName: message.data.profile?.displayName,
          description: message.data.profile?.description,
        }
        if (message.data.profile?.displayPicture && message.attachments) {
          const attachment = message.attachments.find(
            a => a.id === message.data.profile?.displayPicture.replace('#', '') && a.data?.base64
          )
          if (attachment && attachment.data?.base64) {
            userProfile.displayPicture = attachment.data.base64
          }
        }
        debug('Decoded User Profile:', userProfile)

        // Add decoded User Profile metadata to the message
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
          value: JSON.stringify(userProfile),
        })

        // Respond with our own profile if requested
        if (message.data.send_back_yours) {
          assertMessageFieldDefined(message.to, 'to', messageType)
          assertMessageFieldDefined(message.from, 'from', messageType)
          return this.createMessage({
            type: UserProfileV1MessageTypes.PROFILE,
            from: message.to,
            to: message.from,
            pthid: message.id,
            send_back_yours: false,
            profile: await this.userProfileStore.getProfile(message.to),
          })
        }

        return null
      default:
        debug('Unknown User Profile message type:', messageType.type, message)
        throwUnsupportedMessageType(messageType)
    }
  }
}
