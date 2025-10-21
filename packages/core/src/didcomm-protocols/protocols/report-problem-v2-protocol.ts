import { IAgentContext } from '@veramo/core-types'
import type { IDIDComm, IDIDCommMessage } from '@veramo/did-comm'
import type { Message } from '@veramo/message-handler'
import Debug from 'debug'
import { v4 } from 'uuid'

import { DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE } from '../dicomm-protocols-message-handler'
import type {
  IDIDCommMessageType,
  IDIDCommProtocolHandler,
  IDIDCommProtocols,
  IProtocolMessageArgs,
} from '../didcomm-protocols-interface'
import { assertMessageFieldDefined } from '../didcomm-utils'

const debug = Debug('veramo:did-comm:report-problem-protocol-handler')

type IContext = IAgentContext<IDIDCommProtocols & IDIDComm>

/**
 * Structure of an Error Report
 */
export interface ErrorReport {
  /**
   * A machine-readable code that indicates the error condition being reported.
   */
  code: string
  /**
   * The thread ID of the message that caused the error.
   */
  pthid: string
  /**
   * A human-readable description of the error condition.
   */
  comment?: string
  /**
   * A contact detail (e.g., email, phone, URL) where the sender of the report can escalate the issue.
   */
  escalate_to?: string | undefined
}

/**
 * Problem Report V2 Protocol Message Types
 */
export enum ReportProblemV2MessageTypes {
  PROBLEM_REPORT = 'https://didcomm.org/report-problem/2.0/problem-report',
}

/**
 * Arguments to create a Problem Report message
 */
export interface ReportProblemArgs {
  type: ReportProblemV2MessageTypes.PROBLEM_REPORT
  from: string
  to: string
  pthid: string
  code: string
  comment?: string
  args?: string[] | undefined
  escalate_to?: string | undefined
}

/**
 * Add Message Types to the Protocol Message Registry
 */
declare module '../didcomm-protocols-interface' {
  interface ProtocolMessageRegistry {
    [ReportProblemV2MessageTypes.PROBLEM_REPORT]: ReportProblemArgs
  }
}

/**
 * Implementation of the Problem Report V2.0 Protocol Handler
 * Reference: https://didcomm.org/report-problem/2.0
 */
export class DCReportProblemProtocolV2 implements IDIDCommProtocolHandler {
  name = 'Problem Report'
  version = '2.0'
  piuri = 'https://didcomm.org/report-problem'
  description = 'Enables the sender to send problem reports if errors occur.'

  /** {@inheritdoc IDIDCommProtocolHandler.createMessage} */
  createMessage(args: IProtocolMessageArgs): IDIDCommMessage {
    switch (args.type) {
      case ReportProblemV2MessageTypes.PROBLEM_REPORT:
        const problemReportMsg = {
          type: ReportProblemV2MessageTypes.PROBLEM_REPORT,
          id: v4(),
          from: args.from,
          to: [args.to],
          pthid: args.pthid,
          body: {
            code: args.code,
            comment: args.comment,
            args: args.args,
            escalate_to: args.escalate_to,
          },
        }
        if (args.args) {
          problemReportMsg.body.args = args.args
        }
        if (args.escalate_to) {
          problemReportMsg.body.escalate_to = args.escalate_to
        }
        return problemReportMsg
      default:
        debug(`unsupported_message_type is not supported by Problem Report v2.0:`, args)
        throw new Error('unsupported_message_type is not supported by Problem Report v2.0')
    }
  }

  /** {@inheritdoc IDIDCommProtocolHandler.handle} */
  async handle(
    messageType: IDIDCommMessageType,
    message: Message,
    _context: IContext
  ): Promise<IDIDCommMessage | null> {
    // Problem Report is a one-way message, no response is expected, just decode the
    // report and return null
    debug('Received Problem Report message:', message)
    assertMessageFieldDefined(message.data.code, 'body.code', messageType)
    const errorReport: ErrorReport = {
      code: message.data.code,
      pthid: message.data.pthid,
    }
    if (message.data.comment) {
      errorReport.comment = this._processComment(message.data.comment, message.data.args)
    }
    if (message.data.escalate_to) {
      errorReport.escalate_to = message.data.escalate_to
    }

    // Add decoded Problem Report metadata to the message
    message.addMetaData({
      type: DIDCOMM_PROTOCOL_DECODED_MESSAGE_METADATA_TYPE,
      value: JSON.stringify(errorReport),
    })
    return null
  }

  /**
   * Replaces numbered placeholders {1}, {2}, ... in the comment string
   * with corresponding args values from the array. If an index doesn’t exist in args,
   * the placeholder is left unchanged (e.g., {3} stays {3})
   *
   * @param comment The message comment containing placeholders.
   * @param args The array of replacement values.
   * @returns The processed comment string.
   */
  private _processComment(comment: string, args?: string[] | null | undefined): string {
    if (!args || args.length === 0) return comment
    return comment.replace(/\{(\d+)\}/g, (_, index) => {
      const i = parseInt(index, 10) - 1
      return args[i] !== undefined ? args[i] : `{${index}}`
    })
  }
}
