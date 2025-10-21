import type { IAgentContext } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import { DIDCommMessageMediaType } from '@veramo/did-comm'
import { AbstractMessageHandler, Message } from '@veramo/message-handler'

import type { IDIDCommProtocols } from './didcomm-protocols-interface'
import { DIDCommProtocolError } from './didcomm-protocols-interface'
import { getMessageType } from './didcomm-utils'
import { ReportProblemV2MessageTypes } from './protocols'

// const debug = Debug('veramo:did-comm:protocols-message-handler')

type IContext = IAgentContext<IDIDCommProtocols & IDIDComm>

/**
 * Metadata type used to store a decoded DIDComm message
 */
export const DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE = 'DIDCommDecodedMessage'

/**
 * Metadata type used to indicate that a response message should be sent back
 */
export const DIDCOMM_PROTOCOL_RETURN_ROUTE_METADATA_TYPE = 'ReturnRouteResponse'

/**
 * A plugin for the {@link @veramo/message-handler#MessageHandler} that handles DIDComm protocol messages.
 */
export class DIDCommProtocolMessageHandler extends AbstractMessageHandler {
  /**
   * Constructor to create a new DIDCommProtocolMessageHandler instance.
   */
  constructor() {
    super()
  }

  /**
   * Handles various DIDComm protocol messages.
   *
   * @param message - The incoming message to handle.
   * @param context - The agent context containing necessary plugins.
   * @returns A promise that resolves to a response message.
   */
  public override async handle(message: Message, context: IContext): Promise<Message> {
    console.debug('DIDCommProtocolMessageHandler received message:', message)
    try {
      const protocol = await context.agent.getDIDCommProtocol(message.type)
      const messageType = getMessageType(message.type)
      const response = await protocol.handle(messageType, message, context)
      if (response) {
        console.debug('Protocol handler returned response message:', response)
        message.addMetaData({
          type: DIDCOMM_PROTOCOL_RETURN_ROUTE_METADATA_TYPE,
          value: JSON.stringify({
            id: response.id,
            message: response,
            contentType: DIDCommMessageMediaType.PLAIN,
          }),
        })
      }
      return super.handle(message, context)
    } catch (error) {
      const problemReportProtocol = await context.agent.getDIDCommProtocol(
        ReportProblemV2MessageTypes.PROBLEM_REPORT
      )
      let problemReportMessage: IDIDCommMessage
      if (error instanceof DIDCommProtocolError) {
        console.warn('DIDComm protocol error:', error.message, error.args)
        problemReportMessage = problemReportProtocol.createMessage({
          type: ReportProblemV2MessageTypes.PROBLEM_REPORT,
          from: message.to!,
          to: message.from!,
          pthid: message.threadId || message.id,
          code: error.code,
          comment: error.message,
          args: error.args,
        })
      } else {
        console.error('Error handling message:', error)
        problemReportMessage = problemReportProtocol.createMessage({
          type: ReportProblemV2MessageTypes.PROBLEM_REPORT,
          from: message.to!,
          to: message.from!,
          pthid: message.threadId || message.id,
          code: 'internal_error',
          comment: (error as Error).message,
        })
      }
      message.addMetaData({
        type: DIDCOMM_PROTOCOL_RETURN_ROUTE_METADATA_TYPE,
        value: JSON.stringify({
          id: problemReportMessage.id,
          message: problemReportMessage,
          contentType: DIDCommMessageMediaType.PLAIN,
        }),
      })
    }
    return super.handle(message, context)
  }
}
