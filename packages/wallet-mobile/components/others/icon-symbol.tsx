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
type IconMapping = Record<IconSymbolName, ComponentProps<typeof MaterialIcons>['name']>

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home', // Household
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'info.circle': 'info-outline', // Personal Information
  'wallet.pass': 'account-balance-wallet',
  'person.text.rectangle': 'fingerprint',
  'person.fill': 'person', // Profile
  'lock.fill': 'lock',
  'arrow.right.square': 'exit-to-app', // logout icon
  'notifications.fill': 'notifications',
  moon: 'brightness-2',
  smartphone: 'smartphone',
  'help.fill': 'help-outline',
  'arrow.left': 'arrow-back',
  camera: 'photo-camera',
  gear: 'settings',
  'lock.shield.fill': 'security',
  'info.circle.fill': 'info',
}

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
  weight?: SymbolWeight
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />
}
