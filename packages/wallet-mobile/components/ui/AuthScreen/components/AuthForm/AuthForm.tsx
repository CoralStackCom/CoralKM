import OOBField from "@/components/Shared/OOBField";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { AuthFormProps } from "./AuthForm.interface";
import { styles } from "./AuthForm.style";

/**
 * Authentication form component for OOB code verification
 */
export default function AuthForm({
  focused = false,
  onAuthenticate,
  onBack,
  onSplash,
}: AuthFormProps) {
  // Component State
  const [oobCode, setOobCode] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [displayError, setDisplayError] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  /**
   * Autofocus input when form is focused
   */
  useEffect(() => {
    if (focused) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [focused]);

  /**
   * Handle OOB code authentication
   */
  // const handleAuthentication = async () => {
  //   setIsLoading(true);
  //   try {
  //     await onAuthenticate(oobCode);
  //     setShowAuthForm(false);
  //     onSplash();
  //   } catch (err) {
  //     setDisplayError(String(err));
  //     setIsLoading(false);
  //   }
  // };

  // Render
  return (
    <View style={styles.container}>
      {showAuthForm && (
        <View style={styles.formBox}>
          <Image
            source={require("@/assets/svg/logo_black.png")}
            style={{ height: 50, resizeMode: "contain" }}
          />
          <Text style={styles.title}>Enter Your Verification Code</Text>
          {displayError && <Text style={styles.error}>{displayError}</Text>}
          <OOBField
            digitCount={6}
            onSubmit={async (code) => {
              await onAuthenticate(code);
            }}
          />

          <View style={styles.formBottom}>
            <Text style={styles.bottomText}>Didn’t Receive Your Code?</Text>
            <TouchableOpacity style={styles.button} onPress={onBack}>
              <Text style={styles.btnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
