import { Info } from 'lucide-react'
import type React from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import type { IChannel, IChannelMessage } from '../providers/wallet'
import { ChatMessage } from './channel-message'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Drawer } from './ui/drawer'

interface ChannelViewProps {
  channel: IChannel | null
  styleMessage?: (message: IChannelMessage) => {
    title: string | React.ReactElement
    body: string | React.ReactElement
  }
}

export function ChannelView({ channel, styleMessage }: ChannelViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedMessage, setSelectedMessage] = useState<IChannelMessage | null>(null)
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false)
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false)

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channel?.messages.length, channel?.id])

  const handleViewMessage = (message: IChannelMessage) => {
    setSelectedMessage(message)
    setIsMessageDrawerOpen(true)
  }

  if (!channel) {
    return null
  }
  ;<span className="truncate max-w-[220px]"></span>
  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={
              channel.profile?.displayPicture
                ? `data:image/png;base64,${channel.profile?.displayPicture}`
                : undefined
            }
            alt={channel.profile.displayName}
          />
          <AvatarFallback>{channel.profile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2
          className="font-semibold text-foreground truncate max-w-[220px]"
          title={channel.profile.displayName}
        >
          {channel.profile.displayName}
        </h2>
        <Button
          title="Info"
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-black/10"
          onClick={() => {
            setIsChannelDrawerOpen(true)
          }}
        >
          <Info className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-background pb-20 scroll-pb-20">
        {channel.messages.map(message => (
          <ChatMessage
            key={message.message.id}
            message={message}
            channel={channel}
            onViewMessage={handleViewMessage}
            styleMessage={styleMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Drawer
        isOpen={isMessageDrawerOpen}
        handleCloseDrawer={() => {
          setIsMessageDrawerOpen(false)
          setTimeout(() => setSelectedMessage(null), 300)
        }}
        title="Message Data"
      >
        {selectedMessage && (
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
            {JSON.stringify(selectedMessage.message, null, 2)}
          </pre>
        )}
      </Drawer>

      <Drawer
        isOpen={isChannelDrawerOpen}
        handleCloseDrawer={() => {
          setIsChannelDrawerOpen(false)
        }}
        title="Channel Info"
      >
        {channel && (
          <>
            <h3 className="font-semibold mb-2">DID:</h3>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(channel.did, null, 2)}
            </pre>
            {channel.routing_did && (
              <>
                <h3 className="font-semibold my-2">Routing DID:</h3>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                  {channel.routing_did}
                </pre>
              </>
            )}
            <h3 className="font-semibold mb-2">Supported Features:</h3>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(channel.features, null, 2)}
            </pre>
          </>
        )}
      </Drawer>
    </div>
  )
}
