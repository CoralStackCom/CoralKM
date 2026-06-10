export interface SetupEntropyStepProps {
  // Callback when the user completes the step with the generated seed
  onNext: (seed: string) => void
  // Label for the next step button
  nextStep: string
}
