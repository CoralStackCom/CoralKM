import { Href, Link } from 'expo-router'
import type { ComponentProps } from 'react'

/**
 * Props for ExternalLink component
 *
 * Extends Expo Router Link props but enforces string-based external href.
 */
export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  /**
   * External URL to open
   */
  href: Href & string
}
