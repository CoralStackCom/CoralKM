export interface SetupHouseholdStepProps {
  // Label for the next step button
  nextStep: string
  // Suggested name for the household
  suggestedName: string
  // a call back for the next step
  onNext: (name: string, country: string, currency: string, logo?: string) => void
}
