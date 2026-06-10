import { IChannel } from '@/providers/wallet'

/**
 * Props for ChannelView component.
 */
export interface ChannelViewProps {
  /** The channel to display */
  channel: IChannel | undefined
  /** Function to style messages */
  styleMessage: (message: any) => any
  /** Callback to select/deselect a channel */
  selectChannel: (channel: IChannel | null) => void
}
