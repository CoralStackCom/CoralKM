import { ViewProps } from 'react-native'

export type ThemedViewProps = ViewProps & {
  /** Optional light color override */
  lightColor?: string
  /** Optional dark color override */
  darkColor?: string
}
