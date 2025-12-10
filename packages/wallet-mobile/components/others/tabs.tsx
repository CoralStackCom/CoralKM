import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface TabsProps {
  defaultValue: string
  children?: React.ReactNode
  onValueChange?: (value: string) => void
}

interface TabsListProps {
  children?: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  children?: React.ReactNode
}

interface TabsContentProps {
  value: string
  children?: React.ReactNode
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: '',
  onValueChange: () => {},
})

export function Tabs({ defaultValue, children, onValueChange }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

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

export function TabsList({ children }: TabsListProps) {
  return <View style={styles.list}>{children}</View>
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext)
  const isActive = value === activeValue

  return (
    <Pressable
      style={[styles.trigger, isActive && styles.triggerActive]}
      onPress={() => onValueChange(value)}
    >
      <Text style={[styles.triggerText, isActive && styles.triggerTextActive]}>
        {typeof children === 'string' ? children : children}
      </Text>
    </Pressable>
  )
}

export function TabsContent({ value, children }: TabsContentProps) {
  const { value: activeValue } = React.useContext(TabsContext)

  if (value !== activeValue) return null

  return <View style={styles.content}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  list: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 3,
  },
  trigger: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  triggerTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
  },
})
