import { TextInput } from 'react-native'

export interface InputProps extends React.ComponentProps<typeof TextInput> {
  /**
   * Optional custom class name (for compatibility / future usage)
   */
  className?: string
}
