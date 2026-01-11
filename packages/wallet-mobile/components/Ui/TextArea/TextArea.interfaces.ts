import { TextInput } from 'react-native'

export interface TextareaProps extends React.ComponentProps<typeof TextInput> {
  /**
   * Optional custom class name (for compatibility / future usage)
   *
   * */
  className?: string
}
