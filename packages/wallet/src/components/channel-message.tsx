import { Eye } from 'lucide-react'
import type React from 'react'

import { getContrastTextColor } from '../lib/style-messages'
import { cn } from '../lib/utils'
import type { IChannel, IChannelMessage } from '../providers/wallet'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

interface MessageContent {
  title: string | React.ReactElement
  body: string | React.ReactElement
  color?: string
}

interface ChatMessageProps {
  message: IChannelMessage
  channel: IChannel
  onViewMessage: (message: IChannelMessage) => void
  styleMessage?: (message: IChannelMessage) => MessageContent
}

export function ChatMessage({ message, channel, onViewMessage, styleMessage }: ChatMessageProps) {
  // Use custom styling if provided, otherwise use defaults
  const content = styleMessage
    ? styleMessage(message)
    : {
        title: message.is_sent ? 'You' : channel.profile.displayName,
        body: JSON.stringify(message.message.body, null, 2),
      }

  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const textColor = content.color
    ? getContrastTextColor(content.color) === '#000000'
      ? 'text-secondary-foreground'
      : 'text-primary-foreground'
    : message.is_sent
      ? 'text-primary-foreground'
      : 'text-secondary-foreground'

  const titleBorderColor =
    textColor === 'text-primary-foreground'
      ? 'border-primary-foreground/20'
      : 'border-secondary-foreground/20'

  return (
    <div
      className={cn('flex gap-2', message.is_sent ? 'justify-end' : 'justify-start items-start')}
    >
      {!message.is_sent && (
        <Avatar className="h-8 w-8 flex-shrink-0 mt-0">
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
      )}
      <div className={cn('flex flex-col', message.is_sent ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-[18px] max-w-[70vw] md:max-w-md overflow-hidden',
            textColor,
            'rounded-br-sm',
            !content.color && (message.is_sent ? 'bg-primary' : 'bg-secondary')
          )}
          style={content.color ? { backgroundColor: content.color } : undefined}
        >
          {/* Title Bar inside bubble */}
          <div
            className={cn(
              'flex items-center justify-between px-4 py-1.5 border-b',
              titleBorderColor
            )}
          >
            <span className="text-xs font-medium opacity-80">{content.title}</span>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-6 w-6 hover:bg-black/10', textColor)}
              onClick={() => onViewMessage(message)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
          {/* Message content */}
          <div className="px-4 py-2">
            {typeof content.body === 'string' ? (
              <p className="text-[15px] leading-relaxed break-words">{content.body}</p>
            ) : (
              content.body
            )}
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">{timestamp}</span>
      </div>
    </div>
  )
}
