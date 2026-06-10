import { Stepper } from '@/components/Stepper'
import { StepPanel } from '@/components/Stepper/components'
import { useUserContext } from '@/providers/UserContext'
import type { User } from '@/types'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SetupHouseholdStep, SetupUserStep } from './components/steps'
import { SetupEntropyStep } from './components/steps/SetupEntropyStep'
import { styles } from './SetupScreen.styles'

/**
 * SetupScreen component.
 *
 * A multi-step setup wizard to onboard new users through
 * profile creation, household setup, and encryption key generation.
 */

export const SetupScreen: React.FC = () => {
  // Router and State Management
  const router = useRouter()
  // UserContext is the single source of truth — login captured the email here,
  // and each setup step writes its data into it (and persists to SecureStore).
  const { user, setEncryptionSeed } = useUserContext()
  const [activeStep, setActiveStep] = useState(1)
  const [isOpen, setIsOpen] = useState(true)

  // Prefill the steps from whatever the login/earlier steps already stored.
  const authenticatedUser: Partial<User> = {
    id: user?.id,
    email: user?.email,
    firstName: user?.firstName,
    lastName: user?.lastName,
    avatar: user?.avatar,
  }

  /* Handlers */
  const handleUpdateUser = (_firstName: string, _lastName: string, _avatar?: string) => {
    // SetupUserStep already persists the fields into UserContext as they change.
    setActiveStep(2)
  }
  const handleEntropySeed = (seed: string) => {
    setEncryptionSeed(seed)
    setActiveStep(4)
  }
  const handleCreateHousehold = (
    _name: string,
    _country: string,
    _currency: string,
    _logo?: string
  ) => {
    setActiveStep(3)
  }

  const handleComplete = () => {
    setIsOpen(false)
    router.replace('/(tabs)/Wallet')
  }
  /* Render */
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.background}>
        <Stepper
          activeStep={activeStep}
          labels={['Profile', 'Household', 'Encryption', 'Complete']}
          open={isOpen}
          onTransitionEnd={() => console.log('Setup closed')}
        >
          <SetupUserStep
            nextStep="Next - Create Your Household"
            onNext={handleUpdateUser}
            authenticatedUser={authenticatedUser}
          />
          <SetupHouseholdStep
            nextStep="Next - Setup Encryption Keys"
            onNext={handleCreateHousehold}
            suggestedName={`The ${authenticatedUser.lastName || 'Smith'} Household`}
          />
          <SetupEntropyStep nextStep="Continue" onNext={handleEntropySeed} />
          <StepPanel
            title="Woohoo! You're Ready To Get Started!"
            nextStep="Finish"
            isReady={true}
            onNext={handleComplete}
          >
            <View style={styles.completeContainer}>
              <View style={styles.videoPlaceholder}>
                <View style={styles.playButton} />
              </View>
            </View>
          </StepPanel>
        </Stepper>
      </View>
    </GestureHandlerRootView>
  )
}
export default SetupScreen
