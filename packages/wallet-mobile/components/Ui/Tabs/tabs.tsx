import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  TabsContentProps,
  TabsContextValue,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
} from './Tabs.interfaces'
import { styles } from './Tabs.styles'

const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {},
})

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, onValueChange }) => {
  const [value, setValue] = useState(defaultValue)

  /**
   * Handle active tab change
   */
  const handleChange = (newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <View style={styles.container}>{children}</View>
    </TabsContext.Provider>
  )
}

/**
 * TabsList component.
 *
 * Wraps tab triggers.
 */

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return <View style={styles.list}>{children}</View>
}

/**
 * TabsTrigger component.
 *
 * Activates a tab when pressed.
 */

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext)
  const isActive = value === activeValue

  return (
    <Pressable
      style={[styles.trigger, isActive && styles.triggerActive]}
      onPress={() => onValueChange(value)}
    >
      <Text style={[styles.triggerText, isActive && styles.triggerTextActive]}>{children}</Text>
    </Pressable>
  )
}

/**
 * TabsContent component.
 *
 * Renders content only when its value matches the active tab.
 */

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const { value: activeValue } = React.useContext(TabsContext)

  if (value !== activeValue) return null

  return <View style={styles.content}>{children}</View>
}
