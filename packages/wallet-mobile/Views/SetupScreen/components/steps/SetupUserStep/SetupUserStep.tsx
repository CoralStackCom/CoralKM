import { StepPanel } from '@/components/Stepper/components'
import AvatarUpload from '@/components/ui/AvatarUploading'
import { Input } from '@/components/ui/Input'
import { useFormValidation, validators } from '@/hooks'
import { useUserContext } from '@/providers/UserContext'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import { SetupUserStepProps } from './SetupUserStep.interfaces'
import { styles } from './SetupUserStep.styles'

const schema = {
  firstName: [
    validators.required('First Name is required'),
    validators.name(),
    validators.maxLength(40),
  ],
  lastName: [
    validators.required('Last Name is required'),
    validators.name(),
    validators.maxLength(40),
  ],
}

/**
 * Setup User Step
 * A step in the setup wizard that collects and updates
 * the user's personal details.
 */

export const SetupUserStep: React.FC<SetupUserStepProps> = ({
  nextStep,
  authenticatedUser,
  onNext,
}) => {
  // component States
  const { updateUser } = useUserContext()
  const [firstName, setFirstName] = useState(authenticatedUser.firstName || '')
  const [lastName, setLastName] = useState(authenticatedUser.lastName || '')
  const [avatar, setAvatar] = useState(authenticatedUser.avatar ?? '')
  const { errors, validateAll, clearFieldError } = useFormValidation(schema)

  const isFirstTimeUser = !authenticatedUser.firstName && !authenticatedUser.lastName

  const handleNext = () => {
    if (validateAll({ firstName, lastName })) {
      onNext(firstName, lastName, avatar)
    }
  }

  const isReady = firstName.trim() !== '' && lastName.trim() !== ''
  // Persist personal details into the shared UserContext as they change.
  useEffect(() => {
    if (firstName || lastName || avatar) {
      updateUser({ firstName, lastName, avatar })
    }
  }, [firstName, lastName, avatar, updateUser])

  return (
    <StepPanel
      title="Your Personal Details"
      nextStep={nextStep}
      isReady={isReady}
      onNext={handleNext}
    >
      <Text style={styles.description}>
        {isFirstTimeUser
          ? "Welcome! As this is your first trip below the surface, we'll need your personal details before you enter:"
          : 'Welcome back! First, lets confirm your personal details below:'}
      </Text>

      <View style={styles.avatarContainer}>
        <AvatarUpload uri={avatar} onImageChange={setAvatar} />
        <Text style={styles.label}>User Avatar</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          First Name <Text style={styles.required}>*</Text>
        </Text>
        <Input
          style={styles.input}
          placeholder="Enter your First Name"
          value={firstName}
          maxLength={40}
          showCounter
          autoCapitalize="words"
          onChangeText={(text) => {
            setFirstName(text)
            clearFieldError('firstName')
          }}
          error={errors.firstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Last Name <Text style={styles.required}>*</Text>
        </Text>
        <Input
          style={styles.input}
          placeholder="Enter your Last Name"
          value={lastName}
          maxLength={40}
          showCounter
          autoCapitalize="words"
          onChangeText={(text) => {
            setLastName(text)
            clearFieldError('lastName')
          }}
          error={errors.lastName}
        />
      </View>
    </StepPanel>
  )
}
export default SetupUserStep
