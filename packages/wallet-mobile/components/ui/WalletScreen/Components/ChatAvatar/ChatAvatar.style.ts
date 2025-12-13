import { StyleSheet } from 'react-native'

export const styles = (size: number, bgColor?: string) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bgColor ?? 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },

    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },

    initials: {
      fontSize: size / 2,
      fontWeight: '600',
      color: '#fff',
    },
  })
