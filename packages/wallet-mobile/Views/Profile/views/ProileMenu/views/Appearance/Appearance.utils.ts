import { AccentColor, Theme } from './Appearance.interfaces'

export const themes: { key: Theme; label: string; icon: string }[] = [
  { key: 'light', label: 'Light', icon: 'wb-sunny' },
  { key: 'dark', label: 'Dark', icon: 'moon.fill' },
  { key: 'system', label: 'System', icon: 'gear' },
]

export const colors: { key: AccentColor; hex: string }[] = [
  { key: 'blue', hex: '#1B5678' },
  { key: 'green', hex: '#34c759' },
  { key: 'purple', hex: '#af52de' },
  { key: 'orange', hex: '#ff9500' },
  { key: 'pink', hex: '#ff2d55' },
]
