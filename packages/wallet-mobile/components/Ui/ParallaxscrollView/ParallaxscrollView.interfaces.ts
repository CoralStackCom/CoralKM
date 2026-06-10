import { PropsWithChildren, ReactElement } from 'react'

/**
 * ParallaxScrollView props.
 */
export interface ParallaxScrollViewProps extends PropsWithChildren {
  /**
   * Header image element
   */
  headerImage: ReactElement
  /**
   * Header background colors for light and dark themes
   */
  headerBackgroundColor: {
    light: string
    dark: string
  }
}
