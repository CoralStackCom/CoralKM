// Cross-platform icon component (MaterialIcons on iOS, Android, and web).
//
// Note: this intentionally replaces the previous iOS-only SF Symbols variant.
// Many of the app's icon names are not valid SF Symbols, so they rendered blank
// on iOS. Using the MaterialIcons mapping on every platform guarantees a
// consistent look and no missing glyphs.

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight } from 'expo-symbols'
import { ComponentProps } from 'react'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

export type IconSymbolName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'info.circle'
  | 'wallet.pass'
  | 'person.text.rectangle'
  | 'person.fill'
  | 'lock.fill'
  | 'lock'
  | 'lock.shield.fill'
  | 'arrow.right.square'
  | 'arrow.left'
  | 'notifications.fill'
  | 'moon'
  | 'moon.fill'
  | 'sun.fill'
  | 'smartphone'
  | 'help.fill'
  | 'camera'
  | 'gear'
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
  | 'privacy.security.fill'
  | 'download.data.fill'
  | 'activity.alerts.fill'
  | 'budget.alerts.fill'
  | 'monthly.reports.fill'
  | 'report.bug.fill'
  | 'help.support.fill'
  | 'notifications.page.fill'
  | 'line.3.horizontal'
  | 'pencil'
  | 'checkmark'
  | 'faceid'
  | 'touchid'
  | 'delete.left'
  | 'message.fill'
  | 'book'
  | 'video'
  | 'bug'
  | 'bell'
  | 'house'
  | 'calendar'
  | 'mail'
  | 'megaphone'
  | 'key'
  | 'location'
  | 'trash.fill'
  | 'flashlight.on.fill'
  | 'flashlight.off.fill'
  | 'photo.on.rectangle'
  | 'exclamationmark.triangle'
  | 'xmark'
  | 'qrcode'

type IconMapping = Record<IconSymbolName, ComponentProps<typeof MaterialIcons>['name']>

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'info.circle': 'info-outline',
  'wallet.pass': 'account-balance-wallet',
  'person.text.rectangle': 'badge',
  'person.fill': 'person',
  'lock.fill': 'lock',
  lock: 'lock',
  'lock.shield.fill': 'security',
  'arrow.right.square': 'open-in-new',
  'arrow.left': 'arrow-back',
  'notifications.fill': 'notifications',
  moon: 'dark-mode',
  'moon.fill': 'brightness-2',
  'sun.fill': 'wb-sunny',
  smartphone: 'smartphone',
  'help.fill': 'help',
  camera: 'camera-alt',
  gear: 'settings',
  'info.circle.fill': 'info',
  'warning.fill': 'warning',
  'inbox.fill': 'inbox',
  'location.fill': 'location-on',
  'key.fill': 'vpn-key',
  'touch.fill': 'touch-app',
  'announcement.fill': 'campaign',
  'mail.fill': 'mail-outline',
  'calendar.fill': 'calendar-today',
  'chart.fill': 'bar-chart',
  'card.fill': 'credit-card',
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
  'privacy.security.fill': 'security',
  'download.data.fill': 'cloud-download',
  'activity.alerts.fill': 'notifications-active',
  'budget.alerts.fill': 'attach-money',
  'monthly.reports.fill': 'insert-chart',
  'report.bug.fill': 'bug-report',
  'help.support.fill': 'support-agent',
  'notifications.page.fill': 'notifications',
  'line.3.horizontal': 'menu',
  pencil: 'edit',
  checkmark: 'check',
  faceid: 'face',
  touchid: 'fingerprint',
  'delete.left': 'backspace',
  'message.fill': 'message',
  book: 'menu-book',
  video: 'ondemand-video',
  bug: 'bug-report',
  bell: 'notifications',
  house: 'home',
  calendar: 'calendar-today',
  mail: 'mail-outline',
  megaphone: 'campaign',
  key: 'vpn-key',
  location: 'location-on',
  'trash.fill': 'delete',
  'flashlight.on.fill': 'flash-on',
  'flashlight.off.fill': 'flash-off',
  'photo.on.rectangle': 'photo-library',
  'exclamationmark.triangle': 'error-outline',
  xmark: 'close',
  qrcode: 'qr-code-2',
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
  // Fall back to a visible placeholder rather than rendering nothing if a name
  // is ever passed that isn't in the mapping.
  const glyph = MAPPING[name] ?? 'help-outline'
  return <MaterialIcons color={color} size={size} name={glyph} style={style} />
}
