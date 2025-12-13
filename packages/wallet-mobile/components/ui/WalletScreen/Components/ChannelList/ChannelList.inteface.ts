import { IChannel } from '@/providers/wallet'

export interface ChannelListProps {
  channels: IChannel[]
  selectedChannel: IChannel | null
  onSelectChannel: (channel: IChannel) => void
  onAddChannel: (did: string) => void
}
