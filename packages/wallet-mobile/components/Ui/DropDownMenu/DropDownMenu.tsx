import React, { createContext, useContext, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
  DropdownContextValue,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuProps,
  DropdownMenuTriggerProps,
} from './DropDownMenu.interfaces'
import { styles } from './DropDownMenu.styles'

const DropdownContext = createContext<DropdownContextValue>({
  isOpen: false,
  setIsOpen: () => {},
})

/**
 * DropdownMenu root provider.
 *
 * Manages open/close state for dropdown menu components.
 */
export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>{children}</DropdownContext.Provider>
  )
}

/**
 * DropdownMenuTrigger component.
 *
 * Toggles dropdown menu visibility when pressed.
 */
export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext)

  return <Pressable onPress={() => setIsOpen(!isOpen)}>{children}</Pressable>
}

/**
 * DropdownMenuContent component.
 *
 * Displays the dropdown menu inside a modal overlay.
 */
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext)

  if (!isOpen) return null

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)} />
      <View style={styles.content}>
        <ScrollView>{children}</ScrollView>
      </View>
    </Modal>
  )
}

/**
 * DropdownMenuItem component.
 *
 * Represents a selectable item inside the dropdown menu.
 */
export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  onPress,
  children,
  variant = 'default',
}) => {
  const { setIsOpen } = useContext(DropdownContext)

  const handlePress = () => {
    onPress?.()
    setIsOpen(false)
  }

  return (
    <Pressable
      style={[styles.item, variant === 'destructive' && styles.itemDestructive]}
      onPress={handlePress}
    >
      <Text style={[styles.itemText, variant === 'destructive' && styles.itemTextDestructive]}>
        {children}
      </Text>
    </Pressable>
  )
}

/**
 * DropdownMenuLabel component.
 *
 * Displays a non-interactive label inside the dropdown menu.
 */
export const DropdownMenuLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.label}>
      <Text style={styles.labelText}>{children}</Text>
    </View>
  )
}

/**
 * DropdownMenuSeparator component.
 *
 * Visual divider between dropdown menu items.
 */
export const DropdownMenuSeparator: React.FC = () => {
  return <View style={styles.separator} />
}
