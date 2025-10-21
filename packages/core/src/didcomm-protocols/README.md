# DIDComm-Protocols Plugin & Message Handler

This plugin adds support for DIDComm v2 protocols on top of the DIDComm V2 protocol. This allows
agents to extend support for different use cases using DIDComm. By default it supports the following
protocols:

- https://didcomm.org/trust-ping/2.0
- https://didcomm.org/discover-features/2.0

All default protocols are under the `./protocols` folder. You

## Setup the Agent

The plugin expects the `@veramo/did-comm` and its message handler to unpack the DIDComm message before
the DIDComm-Protocols message handler and plugin can handle the protocol:

```TypeScript
import type { IMessageHandler, TAgent } from '@veramo/core'
import { createAgent } from '@veramo/core'
import { MessageHandler } from '@veramo/message-handler'
import type { IDIDComm } from '@veramo/did-comm'
import { DIDComm, DIDCommMessageHandler } from '@veramo/did-comm'

import { DIDCommProtocolMessageHandler, DIDCommProtocols } from './didcomm-protocols'
import type { IDIDCommProtocols } from './didcomm-protocols'

type AppAgent = TAgent<IDIDComm & IDIDCommProtocols & IMessageHandler>

agent = createAgent<AppAgent>({
    plugins: [
      new DIDComm(),
      new DIDCommProtocols(),
      new MessageHandler({ messageHandlers: [
        new DIDCommMessageHandler(),
        new DIDCommProtocolMessageHandler()
      ] }),
    ],
  })
```

## DIDCommProtocols (Plugin)

The plugin is required to hold a list of all the registered DIDComm protocols and manage them for the
Message Handler. This will add the necessary methods to the agent to allow the `DIDCommProtocolMessageHandler` to work correctly.

## DIDCommProtocolMessageHandler (Message Handler)

The Message Handler will handle messages that are processed by the agent's `handleMessage()`method. It expects
the message to already be handled and unencrypted via the DIDComm plugin and it's DIDCommMessageHandler, and will use the message.type to get the protocol and handle it appropriately.
