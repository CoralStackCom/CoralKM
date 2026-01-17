// imports
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { TabsProps } from './Tabs.interfaces'
import { styles } from './Tabs.styles'

/**
 * Tabs
 *
 * A generic tab selector component used to switch
 * between multiple views or sections.
 */

export const Tabs = <T extends string>({ tabs, activeTab, onTabChange }: TabsProps<T>) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = tab.key === activeTab

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>{tab.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
