import { StepPanel } from '@/components/Stepper/components'
import AvatarUpload from '@/components/ui/AvatarUploading'
import { Input } from '@/components/ui/Input'
import { useFormValidation, validators } from '@/hooks'
import { useUserContext } from '@/providers/UserContext'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import { SetupHouseholdStepProps } from './SetupHouseholdStep.interfaces'
import { styles } from './SetupHouseholdStep.styles'

const schema = {
  name: [validators.required('Household Name is required')],
  country: [validators.required('Country is required')],
  currency: [validators.required('Currency is required')],
}

/**
 * Setup Household Step
 * A step in the setup wizard that collects and updates
 * the household's  details.
 */

export const SetupHouseholdStep: React.FC<SetupHouseholdStepProps> = ({
  nextStep,
  suggestedName,
  onNext,
}) => {
  const { updateHousehold } = useUserContext()
  const [name, setName] = useState(suggestedName)
  const [country, setCountry] = useState('USA')
  const [currency, setCurrency] = useState('USD')
  const [logo, setLogo] = useState('')
  const { errors, validateAll, clearFieldError } = useFormValidation(schema)

  const handleNext = () => {
    if (validateAll({ name, country, currency })) {
      onNext(name, country, currency, logo)
    }
  }

  const isReady = name.trim() !== '' && country.trim() !== '' && currency.trim() !== ''
  useEffect(() => {
    updateHousehold({ name, country, currency, logo })
  }, [name, country, currency, logo])

  return (
    <StepPanel
      title="Create Your Household"
      nextStep={nextStep}
      isReady={isReady}
      onNext={handleNext}
    >
      <Text style={styles.description}>
        Create your household to manage finances together. This will be the main container for all
        your financial data.
      </Text>

      <View style={styles.logoContainer}>
        <AvatarUpload uri={logo} onImageChange={setLogo} />
        <Text style={styles.label}>Household Logo</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Household Name <Text style={styles.required}>*</Text>
        </Text>
        <Input
          style={styles.input}
          placeholder="Enter household name"
          value={name}
          onChangeText={(text) => {
            setName(text)
            clearFieldError('name')
          }}
          error={errors.name}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Country <Text style={styles.required}>*</Text>
        </Text>
        <Input
          style={styles.input}
          placeholder="Enter country"
          value={country}
          onChangeText={(text) => {
            setCountry(text)
            clearFieldError('country')
          }}
          error={errors.country}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Currency <Text style={styles.required}>*</Text>
        </Text>
        <Input
          style={styles.input}
          placeholder="Enter currency code (e.g., USD)"
          value={currency}
          onChangeText={(text) => {
            setCurrency(text)
            clearFieldError('currency')
          }}
          error={errors.currency}
        />
      </View>
    </StepPanel>
  )
}

export default SetupHouseholdStep
