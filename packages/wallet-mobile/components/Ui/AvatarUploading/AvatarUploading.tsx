import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert, Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from '../icon-symbol'
import { AvatarUploadProps } from './AvatarUploading.interfaces'
import { styles } from './AvatarUploading.styles'

/**
 * Component Properties
 */

/**
 * AvatarUpload component.
 *
 * Displays a user avatar with optional edit functionality.
 *
 * Features:
 * - Shows current avatar or default icon
 * - Allows picking an image from the library
 * - Provides option to remove current photo
 */
export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  uri,
  size = 100,
  onImageChange,
  editable = true,
}) => {
  // Component State
  const [imageUri, setImageUri] = useState(uri)

  /**
   * Request permission to access media library
   */
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

  /**
   * Launch image picker to select a new avatar
   */
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

  /**
   * Show options to change or remove avatar
   */
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
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <IconSymbol name="person.fill" size={80} color="#1B5678" style={{ margin: 'auto' }} />
      )}

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
export default AvatarUpload
