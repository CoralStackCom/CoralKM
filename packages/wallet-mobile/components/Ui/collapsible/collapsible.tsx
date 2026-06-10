import { PropsWithChildren, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { IconSymbol } from '@/components/ui/icon-symbol'
import { ThemedText } from '@/components/ui/ThemedText/themed-text'
import { ThemedView } from '@/components/ui/ThemedView/themed-view'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { CollapsibleProps } from './collapsible.interfaces'
import { styles } from './collapsible.styles'

/**
 * Collapsible component.
 *
 * Displays a header with a title and an arrow icon.
 * When tapped, it toggles the visibility of its children.
 */
export const Collapsible: React.FC<PropsWithChildren<CollapsibleProps>> = ({ children, title }) => {
  /**
   * State to track whether the content is expanded
   */
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Current theme ('light' or 'dark') for icon color
   */
  const theme = useColorScheme() ?? 'light'

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen(value => !value)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  )
}
