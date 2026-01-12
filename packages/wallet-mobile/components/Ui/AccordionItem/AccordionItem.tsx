import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { AccordionItemProps } from './AccordionItem.interfaces'
import { styles } from './AccordionItem.styles'

/**
 * AccordionItem
 *
 * A reusable expandable item component used to show
 * and hide content such as FAQs, details, or explanations.
 */

// component
export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  expanded,
  onToggle,
  activeOpacity = 0.7,
  showDivider = true,
}) => {
  return (
    <View>
      <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={activeOpacity}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.chevron}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}

      {showDivider && <View style={styles.divider} />}
    </View>
  )
}
