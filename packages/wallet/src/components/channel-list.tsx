import { Plus, Shield, ShieldCheck } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

import { cn } from '../lib/utils'
import type { IChannel } from '../providers/wallet'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'

interface ChannelListProps {
  channels: IChannel[]
  selectedChannel: IChannel | null
  onSelectChannel: (channel: IChannel) => void
  onAddChannel: (name: string) => void
}

export function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  onAddChannel,
}: ChannelListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newChannelId, setNewChannelId] = useState('')

  const handleAddChannel = () => {
    if (newChannelId.trim()) {
      onAddChannel(newChannelId.trim())
      setNewChannelId('')
      setIsDialogOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddChannel()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between">
        <h1 className="text-2xl h-10 font-semibold text-foreground">Contacts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Enter the DID URI of the contact you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Contact DID"
                value={newChannelId}
                onChange={e => setNewChannelId(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddChannel} disabled={!newChannelId.trim()}>
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {channels.map(channel => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className={cn(
              'w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors border-b border-border',
              selectedChannel?.id === channel.id && 'sidebar-selected'
            )}
          >
            <Avatar className="h-12 w-12 flex-shrink-0">
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
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-foreground truncate">
                  {channel.profile.displayName}
                </h3>
                {channel.supports_guardian && !channel.is_guardian && (
                  <Shield className="font-semibold text-foreground" />
                )}
                {channel.is_guardian && <ShieldCheck className="font-semibold text-foreground" />}
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  ({channel.messages.length})
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
