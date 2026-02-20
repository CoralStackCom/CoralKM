import { IChannel, IChannelMessage } from '@/providers/wallet'
import type React from 'react'

export interface MessageContent {
  // Title of the message content, can be string or React element
  title: string | React.ReactElement
  // Body of the message content, can be string or React element
  body: string | React.ReactElement
  // Optional color for the message content
  color?: string
}

export interface ChatMessageProps {
  // The channel message to be displayed
  message: IChannelMessage
  // The channel associated with the message
  channel: IChannel
  // Callback function when the message is viewed
  onViewMessage: (message: IChannelMessage) => void
  // Optional function to style the message content
  styleMessage?: (message: IChannelMessage) => MessageContent
}
