import { Link } from 'expo-router'
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import { ExternalLinkProps } from './ExternalLink.styles'

/**
 * ExternalLink component.
 *
 * Opens links in:
 * - In-app browser on native platforms
 * - New tab on web
 */

export const ExternalLink: React.FC<ExternalLinkProps> = ({ href, ...rest }) => {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async event => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent default browser behavior on native platforms
          event.preventDefault()

          // Open link in in-app browser
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          })
        }
      }}
    />
  )
}
