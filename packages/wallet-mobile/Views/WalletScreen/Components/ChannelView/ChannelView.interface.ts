export interface IChannelMessageData {
  id: string
  message: string
}

export interface IChannelMessage {
  message: IChannelMessageData
}

export interface IChannel {
  messages: IChannelMessage[]
}

export interface ChannelViewProps {
  channel: IChannel | undefined
  selectedMessage?: IChannelMessage | null
  onMessagePress: (msg: IChannelMessage) => void
}
