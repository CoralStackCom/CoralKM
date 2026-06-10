import { StyleSheet } from "react-native";

import { VALIDATION_ERROR_COLOR } from "@/constants/validation";

export const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    lineHeight: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: VALIDATION_ERROR_COLOR,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
