import { Stepper } from '@/components/Shared/Stepper'
import { StepPanel } from '@/components/Shared/Stepper/components'
import type { User } from '@/types'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SetupHouseholdStep, SetupUserStep } from './components/steps'
import { SetupEntropyStep } from './components/steps/SetupEntropyStep'
import { styles } from './SetupScreen.style'

// Mock data
const userAvatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
]

const householdAvatars = [
  'https://i.pravatar.cc/150?img=10',
  'https://i.pravatar.cc/150?img=11',
  'https://i.pravatar.cc/150?img=12',
]

export default function SetupScreen() {
  const router = useRouter()

  const [activeStep, setActiveStep] = useState(1)
  const [isOpen, setIsOpen] = useState(true)
  const [encryptionSeed, setEncryptionSeed] = useState<string>('')
  const [authenticatedUser, setAuthenticatedUser] = useState<Partial<User>>({
    id: '1',
    email: 'user@example.com',
  })

  const handleUpdateUser = (firstName: string, lastName: string, avatar?: string) => {
    setAuthenticatedUser({ ...authenticatedUser, firstName, lastName, avatar })
    setActiveStep(2)
  }
  const handleEntropySeed = (seed: string) => {
    setEncryptionSeed(seed)
    setActiveStep(4)
  }
  const handleCreateHousehold = (
    name: string,
    country: string,
    currency: string,
    logo?: string
  ) => {
    setActiveStep(3)
  }

  const handleComplete = () => {
    setIsOpen(false)
    router.replace('/(tabs)/Wallet')
  }

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
            userAvatars={userAvatars}
          />
          <SetupHouseholdStep
            nextStep="Next - Setup Encryption Keys"
            onNext={handleCreateHousehold}
            householdAvatars={householdAvatars}
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
