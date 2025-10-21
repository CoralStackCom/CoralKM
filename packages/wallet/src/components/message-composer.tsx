import type { IDIDCommMessage } from '@veramo/did-comm'
import { Send, ShieldMinus, ShieldPlus } from 'lucide-react'

import type { IChannel, IWalletUser } from '../providers/wallet'
import { Button } from './ui/button'

interface MessageComposerProps {
  selectedChannel: IChannel
  currentUser: IWalletUser
  sendMessage: (message: IDIDCommMessage) => void
  addGuardian: (guardianDID: string) => void
  removeGuardian: (guardianDID: string) => void
}

export function MessageComposer({
  selectedChannel,
  currentUser,
  sendMessage,
  addGuardian,
  removeGuardian,
}: MessageComposerProps) {
  return (
    <div className="border-t border-border bg-card px-4 py-3 flex space-x-2">
      <Button
        onClick={() => {
          const didCommMessage: IDIDCommMessage = {
            type: 'https://didcomm.org/trust-ping/2.0/ping',
            id: crypto.randomUUID(),
            to: [selectedChannel.id],
            from: currentUser.routing_id || currentUser.mediator_id,
            body: {
              responseRequested: true,
            },
          }
          sendMessage(didCommMessage)
        }}
      >
        <Send className="h-4 w-4" />
        <span>Ping</span>
      </Button>
      {selectedChannel.supports_guardian && !selectedChannel.is_guardian && (
        <Button
          className="bg-green-500 hover:bg-green-600 text-black"
          onClick={() => {
            addGuardian(selectedChannel.id)
          }}
        >
          <ShieldPlus className="h-4 w-4" />
          <span>Request Guardianship</span>
        </Button>
      )}
      {selectedChannel.is_guardian && (
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => {
            removeGuardian(selectedChannel.id)
          }}
        >
          <ShieldMinus className="h-4 w-4" />
          <span>Revoke Guardianship</span>
        </Button>
      )}
    </div>
  )
}
