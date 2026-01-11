import type React from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import {
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogTitleProps,
} from './Dialog.interfaces'
import { styles } from './Dialog.styles'

/**
 * Dialog component.
 *
 * Provides a modal overlay with customizable content, header, title, description, and footer.
 * Can be controlled via the `open` prop and closed via `onOpenChange`.
 */
export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
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

/**
 * DialogContent component.
 *
 * Wraps the content inside the dialog and optionally shows a close button.
 */
export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  showCloseButton = true,
}) => {
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

/** DialogHeader component for structuring the header section */
export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <View style={styles.header}>{children}</View>
}

/** DialogTitle component for rendering the dialog's title */
export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return <Text style={styles.title}>{typeof children === 'string' ? children : children}</Text>
}

/** DialogDescription component for rendering descriptive text inside the dialog */
export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children }) => {
  return (
    <Text style={styles.description}>{typeof children === 'string' ? children : children}</Text>
  )
}

/** DialogFooter component for rendering action buttons at the bottom of the dialog */
export const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
  return <View style={styles.footer}>{children}</View>
}
