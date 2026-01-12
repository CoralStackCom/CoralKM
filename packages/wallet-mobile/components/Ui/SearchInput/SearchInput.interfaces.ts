export interface SearchInputProps {
  /** Current search value */
  value: string

  /** Callback fired when text changes */
  onChangeText: (text: string) => void

  /** Placeholder text shown when input is empty */
  placeholder?: string

  /** Optional placeholder text color */
  placeholderTextColor?: string
}
