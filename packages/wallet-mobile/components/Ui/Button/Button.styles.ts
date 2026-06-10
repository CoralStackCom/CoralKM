import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
  },
  default: {
    backgroundColor: '#3B82F6',
  },
  destructive: {
    backgroundColor: '#EF4444',
  },
  outline: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondary: {
    backgroundColor: '#E5E7EB',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
  'size-default': {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  'size-sm': {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  'size-lg': {
    height: 40,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  'size-icon': {
    width: 36,
    height: 36,
  },
  'size-icon-sm': {
    width: 32,
    height: 32,
  },
  'size-icon-lg': {
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
})
