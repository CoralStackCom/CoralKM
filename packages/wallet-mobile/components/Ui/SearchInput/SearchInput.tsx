import React from 'react'
import { TextInput, View } from 'react-native'
import { IconSymbol } from '../icon-symbol'
import { SearchInputProps } from './SearchInput.interfaces'
import { styles } from './SearchInput.styles'

/**
 * SearchInput
 *
 * A reusable search input component with an icon,
 * used for filtering or searching content across the app.
 */

// component
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  placeholderTextColor = '#999',
}) => {
  return (
    <View style={styles.container}>
      <IconSymbol name="search" size={20} style={styles.icon} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  )
}
