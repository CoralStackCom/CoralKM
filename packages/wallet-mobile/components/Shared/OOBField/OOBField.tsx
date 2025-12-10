import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { OOBFieldProps } from "./OOBField.interface";
import { styles } from "./OOBField.style";

/**
 * OOB (Out-of-Band) field component for entering verification codes
 */
export default function OOBField({ digitCount = 6, onSubmit }: OOBFieldProps) {
  // Component State
  const [code, setCode] = useState<string[]>(Array(digitCount).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  /**
   * Reset code when digit count changes
   */
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, digitCount);
    setCode(Array(digitCount).fill(""));
  }, [digitCount]);

  /**
   * Handle digit input change
   */
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value !== "" && index < digitCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      handleSubmit(newCode.join(""));
    }
  };

  /**
   * Handle backspace key press
   */
  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handle paste event for faster code entry
   */
  const handlePaste = async (text: string) => {
    const pasted = text.replace(/\D/g, "").slice(0, digitCount).split("");
    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, digitCount - 1)]?.focus();

    if (newCode.every((digit) => digit !== "")) {
      handleSubmit(newCode.join(""));
    }
  };

  /**
   * Handle code submission
   */
  const handleSubmit = async (verificationCode: string) => {
    setIsLoading(true);
    try {
      await onSubmit?.(verificationCode);
    } catch {
      setCode(Array(digitCount).fill(""));
      setIsLoading(false);
    }
  };

  // Render
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            style={[styles.input, isLoading && { opacity: 0.5 }]}
            value={digit}
            keyboardType="numeric"
            maxLength={1}
            autoFocus={index === 0}
            onChangeText={(value) => {
              if (value.length > 1) {
                handlePaste(value);
              } else {
                handleChange(index, value);
              }
            }}
            onKeyPress={(e) => handleKeyPress(index, e)}
            editable={!isLoading}
          />
        ))}
      </View>
    </View>
  );
}
