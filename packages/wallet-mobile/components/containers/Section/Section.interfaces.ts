import { ViewProps } from 'react-native'

export interface SectionProps extends ViewProps {
  /** Content to be displayed within the section
   * @type React.ReactNode
   * @example <Text>Section Content</Text>
   */
  children: React.ReactNode
}
