import type { IconSymbolName } from '../icon-symbol'

/** The kind of state being represented. */
export type StateVariant = 'loading' | 'empty' | 'error'

export interface StateViewProps {
  /** Which state to render. */
  variant: StateVariant
  /** Primary heading. */
  title: string
  /** Optional supporting message. */
  message?: string
  /** Override the default icon (ignored for `loading`). */
  icon?: IconSymbolName
  /** Optional call-to-action button label. */
  actionLabel?: string
  /** Handler for the call-to-action button. */
  onAction?: () => void
  /** Accent color for the icon chip / spinner (defaults to navy). */
  color?: string
}
