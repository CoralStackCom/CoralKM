import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 24,
  },
  logoBox: { alignItems: "center", marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  error: { color: "red", textAlign: "center", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
  },
  disabled: { opacity: 0.7 },
  formBottom: { marginTop: 20, alignItems: "center" },
  bottomText: { fontSize: 14, marginBottom: 8 },
  button: {
    backgroundColor: "#1B5678",
    padding: 14,
    borderRadius: 48,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
