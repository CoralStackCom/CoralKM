import { StepPanel } from "@/components/Shared/Stepper/components";
import { useState } from "react";
import { Image, Text, TextInput, View } from "react-native";
import { SetupHouseholdStepProps } from "./SetupHouseholdStep.interface";
import { styles } from "./SetupHouseholStep.style";

export default function SetupHouseholdStep({
  nextStep,
  householdAvatars,
  suggestedName,
  onNext,
}: SetupHouseholdStepProps) {
  const [name, setName] = useState(suggestedName);
  const [country, setCountry] = useState("USA");
  const [currency, setCurrency] = useState("USD");
  const [logo, setLogo] = useState(householdAvatars[0]);

  const handleNext = () => {
    onNext(name, country, currency, logo);
  };

  const isReady =
    name.trim() !== "" && country.trim() !== "" && currency.trim() !== "";

  return (
    <StepPanel
      title="Create Your Household"
      nextStep={nextStep}
      isReady={isReady}
      onNext={handleNext}
    >
      <Text style={styles.description}>
        Create your household to manage finances together. This will be the main
        container for all your financial data.
      </Text>

      <View style={styles.logoContainer}>
        <Image source={{ uri: logo }} style={styles.logo} />
        <Text style={styles.label}>Household Logo</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Household Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter household name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Country <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter country"
          value={country}
          onChangeText={setCountry}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Currency <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter currency code (e.g., USD)"
          value={currency}
          onChangeText={setCurrency}
        />
      </View>
    </StepPanel>
  );
}
