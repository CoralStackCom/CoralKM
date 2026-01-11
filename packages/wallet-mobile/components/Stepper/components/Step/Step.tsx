// components/Step.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { StepProps } from "./Step.interface";

/**
 * Displays a Step Panel with form for user to complete
 * before moving onto the next step of the Setup workflow
 */

export default function StepPanel({
  title,
  nextStep,
  children,
  isReady = false,
  onCancel,
  onNext,
}: StepProps) {
  return (
    <View style={styles.stepPanelContainer}>
      <Text style={styles.header} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.childrenContainer}>{children}</View>
      <View style={styles.buttonContainer}>
        {onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onCancel?.()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, !isReady && styles.buttonDisabled]}
          onPress={onNext}
          disabled={!isReady}
        >
          <Text style={styles.buttonText}>{nextStep}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepPanelContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  childrenContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#d32f2f",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  cancelButtonText: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
