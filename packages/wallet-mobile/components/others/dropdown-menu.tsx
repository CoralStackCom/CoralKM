import React, { useState } from "react"
import { View, Pressable, Text, StyleSheet, Modal, ScrollView } from "react-native"

interface DropdownMenuProps {
  children?: React.ReactNode
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children?: React.ReactNode
}

interface DropdownMenuContentProps {
  children?: React.ReactNode
}

interface DropdownMenuItemProps {
  onPress?: () => void
  children?: React.ReactNode
  variant?: "default" | "destructive"
}

const DropdownContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return <DropdownContext.Provider value={{ isOpen, setIsOpen }}>{children}</DropdownContext.Provider>
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownContext)

  return <Pressable onPress={() => setIsOpen(!isOpen)}>{children}</Pressable>
}

export function DropdownMenuContent({ children }: DropdownMenuContentProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownContext)

  if (!isOpen) return null

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)} />
      <View style={styles.content}>
        <ScrollView>{children}</ScrollView>
      </View>
    </Modal>
  )
}

export function DropdownMenuItem({ onPress, children, variant = "default" }: DropdownMenuItemProps) {
  const { setIsOpen } = React.useContext(DropdownContext)

  const handlePress = () => {
    onPress?.()
    setIsOpen(false)
  }

  return (
    <Pressable style={[styles.item, variant === "destructive" && styles.itemDestructive]} onPress={handlePress}>
      <Text style={[styles.itemText, variant === "destructive" && styles.itemTextDestructive]}>
        {typeof children === "string" ? children : children}
      </Text>
    </Pressable>
  )
}

export function DropdownMenuLabel({ children }: { children?: React.ReactNode }) {
  return (
    <View style={styles.label}>
      <Text style={styles.labelText}>{typeof children === "string" ? children : children}</Text>
    </View>
  )
}

export function DropdownMenuSeparator() {
  return <View style={styles.separator} />
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#FFF",
    borderRadius: 6,
    marginTop: 8,
    minWidth: 128,
    maxHeight: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemDestructive: {},
  itemText: {
    fontSize: 14,
    color: "#000",
  },
  itemTextDestructive: {
    color: "#EF4444",
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
})
