export interface IChannel {
  // Unique identifier for the channel
  id: string
  // Profile information associated with the channel
  profile: {
    displayName: string
    displayPicture?: string
  }
  // List of messages in the channel
  messages: IChannelMessage[]
  // Decentralized Identifier for the channel
  did?: string
  // Mediator's Decentralized Identifier
  mediator_did?: string
  // Routing Decentralized Identifier
  routing_did?: string
  // Additional optional properties
  routing_id?: string
  // Mediator's identifier
  mediator_id?: string
  // Supported features of the channel
  features?: string[]
  // Indicates if the channel supports guardians
  supports_guardian?: boolean
  // Indicates if the channel is a guardian
  is_guardian?: boolean
}

export interface IChannelMessage {
  // Unique identifier for the message
  id: string
  // Content of the message
  message: {
    id: string
    body: any
  }
  // Sender's Decentralized Identifier
  is_sent: boolean
  // Message timestamp
  timestamp?: number
}

export interface UserProfile {
  // User's display name
  displayName: string
  // User's display picture URL
  displayPicture?: string
  // User's  routing identifier
  routing_id: string
  // User's mediator identifier
  mediator_id: string
  // User's routing DID
  routing_did?: any
  // User's mediator DID
  mediator_did?: any
}
