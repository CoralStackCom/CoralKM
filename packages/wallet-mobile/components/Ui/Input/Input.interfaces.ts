import { TextInput } from 'react-native'

export interface InputProps extends React.ComponentProps<typeof TextInput> {
  /**
   * Optional custom class name (for compatibility / future usage)
   */
  className?: string
  /**
   * Validation error message. Shows error border and message when non-null.
   */
  error?: string | null
  /**
   * When true and `maxLength` is set, shows a live character counter
   * (e.g. "12/40") under the field.
   */
  showCounter?: boolean
}
