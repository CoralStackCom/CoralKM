import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ColorPickerGridProps } from './ColorPickerGrid.interfaces'
import { styles } from './ColorPickerGrid.styles'

export const ColorPickerGrid: React.FC<ColorPickerGridProps> = ({
  colors,
  value,
  onChange,
  columns = 5,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.grid, { gridTemplateColumns: `repeat(${columns}, 1fr)` }]}>
        {colors?.map(color => {
          const selected = value === color.key

          return (
            <TouchableOpacity
              key={color.key}
              style={[styles.color, { backgroundColor: color.value }, selected && styles.selected]}
              onPress={() => onChange(color.key)}
              activeOpacity={0.8}
            >
              {selected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
