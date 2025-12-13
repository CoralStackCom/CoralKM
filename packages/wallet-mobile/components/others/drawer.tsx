import type React from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: React.ReactNode
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  drawer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
})
