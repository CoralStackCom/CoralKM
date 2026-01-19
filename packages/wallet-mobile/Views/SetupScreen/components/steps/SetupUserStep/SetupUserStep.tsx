import { StepPanel } from '@/components/Stepper/components'
import AvatarUpload from '@/components/ui/AvatarUploading'
import { useUserContext } from '@/providers/UserContext'
import { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { SetupUserStepProps } from './SetupUserStep.interface'
import { styles } from './SetupUserStep.style'

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
  const { user, setUser } = useUserContext()
  const [firstName, setFirstName] = useState(authenticatedUser.firstName || '')
  const [lastName, setLastName] = useState(authenticatedUser.lastName || '')
  const [avatar, setAvatar] = useState(authenticatedUser.avatar)
  const [errors, setErrors] = useState({ firstName: false, lastName: false })

  const isFirstTimeUser = !authenticatedUser.firstName && !authenticatedUser.lastName

  const validate = () => {
    const newErrors = {
      firstName: firstName.trim() === '',
      lastName: lastName.trim() === '',
    }
    setErrors(newErrors)
    return !newErrors.firstName && !newErrors.lastName
  }

  const handleNext = () => {
    if (validate()) {
      onNext(firstName, lastName, avatar)
    }
  }

  const isReady = firstName.trim() !== '' && lastName.trim() !== ''
  useEffect(() => {
    if (user?.id) {
      setUser({ ...user, firstName, lastName, avatar })
    }
  }, [firstName, lastName, avatar])

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
        <TextInput
          style={[styles.input, errors.firstName && styles.inputError]}
          placeholder="Enter your First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        {errors.firstName && <Text style={styles.errorText}>First Name is required</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Last Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.lastName && styles.inputError]}
          placeholder="Enter your Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        {errors.lastName && <Text style={styles.errorText}>Last Name is required</Text>}
      </View>
    </StepPanel>
  )
}
export default SetupUserStep
