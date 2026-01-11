import { IChannel, IChannelMessage } from '@/providers/wallet'
import type React from 'react'

export interface MessageContent {
  title: string | React.ReactElement
  body: string | React.ReactElement
  color?: string
}

export interface ChatMessageProps {
  message: IChannelMessage
  channel: IChannel
  onViewMessage: (message: IChannelMessage) => void
  styleMessage?: (message: IChannelMessage) => MessageContent
}
