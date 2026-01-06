import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface AvatarUploadProps {
  uri: string
  size?: number
  onImageChange?: (uri: string) => void
  editable?: boolean
}

export default function AvatarUpload({
  uri,
  size = 100,
  onImageChange,
  editable = true,
}: AvatarUploadProps) {
  const [imageUri, setImageUri] = useState(uri)

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload a photo.'
        )
        return false
      }
    }
    return true
  }

  const pickImage = async () => {
    const hasPermission = await requestPermission()
    if (!hasPermission) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      const newUri = result.assets[0].uri
      setImageUri(newUri)
      onImageChange?.(newUri)
    }
  }

  const showOptions = () => {
    Alert.alert('Change Profile Photo', 'Choose an option', [
      { text: 'Choose from Library', onPress: pickImage },
      {
        text: 'Remove Current Photo',
        onPress: () => {
          const defaultUri = 'https://i.pravatar.cc/150?img=1'
          setImageUri(defaultUri)
          onImageChange?.(defaultUri)
        },
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
      {editable && (
        <TouchableOpacity
          style={[
            styles.plusButton,
            {
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: (size * 0.3) / 2,
              right: 0,
              bottom: 0,
            },
          ]}
          onPress={showOptions}
          activeOpacity={0.8}
        >
          <Text style={[styles.plusIcon, { fontSize: size * 0.18 }]}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  plusButton: {
    position: 'absolute',
    backgroundColor: '#1B5678',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  plusIcon: {
    color: '#fff',
    fontWeight: '700',
  },
})
