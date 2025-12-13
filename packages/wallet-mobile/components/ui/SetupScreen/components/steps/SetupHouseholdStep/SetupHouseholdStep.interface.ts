export interface SetupHouseholdStepProps {
  nextStep: string;
  householdAvatars: string[];
  suggestedName: string;
  onNext: (
    name: string,
    country: string,
    currency: string,
    logo?: string
  ) => void;
}
