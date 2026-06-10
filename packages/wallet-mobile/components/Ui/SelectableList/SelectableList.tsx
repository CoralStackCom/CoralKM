import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from '../icon-symbol'
import { SelectableListProps } from './SelectableList.interfaces'
import { styles } from './SelectableList.styles'
/*
 * Selectable List Component
 */

export const SelectableList: React.FC<SelectableListProps<any>> = ({ List, value, onChange }) => {
  // Render
  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {List?.map((item, index) => {
        const selected = value === item.key

        return (
          <View key={item.key}>
            <TouchableOpacity
              style={[styles.row, { minHeight: 44 }]}
              onPress={() => onChange(item.key)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              accessibilityHint={selected ? `${item.label} is currently selected` : `Select ${item.label}`}
            >
              <View style={styles.left}>
                {item.icon && <IconSymbol name={item.icon} size={24} style={styles.icon} />}
                <Text style={styles.label}>{item.label}</Text>
              </View>

              <View style={[styles.radioOuter, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>

            {index < List.length - 1 && <View style={styles.divider} />}
          </View>
        )
      })}
    </View>
  )
}
