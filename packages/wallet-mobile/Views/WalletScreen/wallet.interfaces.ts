export interface IChannel {
  id: string
  profile: {
    displayName: string
    displayPicture?: string
  }
  messages: IChannelMessage[]
  did?: string
  routing_did?: string
  routing_id?: string
  mediator_id?: string
  features?: string[]
  supports_guardian?: boolean
  is_guardian?: boolean
}

export interface IChannelMessage {
  id: string
  message: {
    id: string
    body: any
  }
  is_sent: boolean
  timestamp?: number
}

export interface UserProfile {
  displayName: string
  displayPicture?: string
  routing_id: string
  mediator_id: string
  routing_did?: any
  mediator_did?: any
}
