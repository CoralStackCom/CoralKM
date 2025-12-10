import type React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  style?: any
  children?: React.ReactNode
}

interface AvatarImageProps {
  source: any
  alt?: string
}

interface AvatarFallbackProps {
  children?: React.ReactNode
}

export function Avatar({ size = 'md', style, children }: AvatarProps) {
  return <View style={[styles.avatar, styles[`size-${size}`], style]}>{children}</View>
}

export function AvatarImage({ source, alt }: AvatarImageProps) {
  return <Image source={source} style={styles.image} accessibilityLabel={alt} />
}

export function AvatarFallback({ children }: AvatarFallbackProps) {
  return (
    <View style={styles.fallback}>
      {typeof children === 'string' ? (
        <Text style={styles.fallbackText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'size-sm': {
    width: 32,
    height: 32,
  },
  'size-md': {
    width: 40,
    height: 40,
  },
  'size-lg': {
    width: 48,
    height: 48,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
})
