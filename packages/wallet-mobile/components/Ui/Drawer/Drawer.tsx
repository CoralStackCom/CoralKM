import type React from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { DrawerProps } from './Drawer.interfaces'
import { styles } from './Drawer.styles'

/**
 * Drawer component.
 *
 * Provides a sliding drawer modal from the side of the screen.
 * Can be closed by pressing the overlay or the close button.
 */
export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Semi-transparent overlay */}
        <Pressable style={styles.overlay} onPress={onClose} />

        {/* Drawer content */}
        <View style={styles.drawer}>
          {/* Drawer Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Drawer body */}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  )
}

export default Drawer
