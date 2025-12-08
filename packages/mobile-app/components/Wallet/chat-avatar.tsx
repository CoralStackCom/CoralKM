import { Image, Text, View } from 'react-native'

interface ChatAvatarProps {
  name: string
  picture?: string
  size?: number
}

export function ChatAvatar({ name, picture, size = 48 }: ChatAvatarProps) {
  const initials = name.charAt(0).toUpperCase()
  const bgColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][name.charCodeAt(0) % 5]

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: picture ? 'transparent' : bgColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {picture ? (
        <Image
          source={{ uri: `data:image/png;base64,${picture}` }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text style={{ fontSize: size / 2, fontWeight: '600', color: '#fff' }}>{initials}</Text>
      )}
    </View>
  )
}
