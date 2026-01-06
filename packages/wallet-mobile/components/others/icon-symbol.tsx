// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight } from 'expo-symbols'
import { ComponentProps } from 'react'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

type IconSymbolName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'info.circle'
  | 'wallet.pass'
  | 'person.text.rectangle'
  | 'person.fill'
  | 'lock.fill'
  | 'arrow.right.square'
  | 'notifications.fill'
  | 'moon'
  | 'smartphone'
  | 'help.fill'
  | 'camera'
  | 'arrow.left'
  | 'gear'
  | 'lock.shield.fill'
  | 'info.circle.fill'
  | 'warning.fill'
  | 'inbox.fill'
  | 'location.fill'
  | 'key.fill'
  | 'touch.fill'
  | 'announcement.fill'
  | 'mail.fill'
  | 'calendar.fill'
  | 'chart.fill'
  | 'card.fill'
  | 'moon.fill'
  | 'sun.fill'
  | 'phone.fill'
  | 'tablet.fill'
  | 'desktop.fill'
  | 'bug.fill'
  | 'video.fill'
  | 'book.fill'
  | 'call.fill'
  | 'chat.fill'
  | 'download.alt.fill'
  | 'biometric.fill'
  | 'search'
type IconMapping = Record<IconSymbolName, ComponentProps<typeof MaterialIcons>['name']>

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'warning.fill': 'warning',
  'inbox.fill': 'inbox',
  'location.fill': 'location-on',
  'key.fill': 'vpn-key',
  'notifications.fill': 'notifications',
  'touch.fill': 'touch-app',
  'lock.fill': 'lock',
  'announcement.fill': 'campaign',
  'mail.fill': 'mail-outline',
  'calendar.fill': 'calendar-today',
  'chart.fill': 'bar-chart',
  'card.fill': 'credit-card',
  gear: 'settings',
  'moon.fill': 'brightness-2',
  'sun.fill': 'wb-sunny',
  'phone.fill': 'smartphone',
  'tablet.fill': 'tablet',
  'desktop.fill': 'computer',
  'bug.fill': 'bug-report',
  'video.fill': 'ondemand-video',
  'book.fill': 'menu-book',
  'call.fill': 'call',
  'chat.fill': 'chat-bubble-outline',
  'download.alt.fill': 'file-download',
  'biometric.fill': 'fingerprint',
  search: 'search',
}

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color = '#1B5678',
  style,
}: {
  name: IconSymbolName
  size?: number
  color?: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
  weight?: SymbolWeight
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />
}
