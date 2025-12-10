import type React from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

interface DialogContentProps {
  children?: React.ReactNode
  showCloseButton?: boolean
}

interface DialogHeaderProps {
  children?: React.ReactNode
}

interface DialogTitleProps {
  children?: React.ReactNode
}

interface DialogDescriptionProps {
  children?: React.ReactNode
}

interface DialogFooterProps {
  children?: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onOpenChange(false)} />
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  )
}

export function DialogContent({ children, showCloseButton = true }: DialogContentProps) {
  return (
    <View style={styles.container}>
      {children}
      {showCloseButton && (
        <Pressable style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      )}
    </View>
  )
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <View style={styles.header}>{children}</View>
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <Text style={styles.title}>{typeof children === 'string' ? children : children}</Text>
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <Text style={styles.description}>{typeof children === 'string' ? children : children}</Text>
  )
}

export function DialogFooter({ children }: DialogFooterProps) {
  return <View style={styles.footer}>{children}</View>
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 24,
    maxWidth: '90%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    gap: 16,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#6B7280',
  },
})
