import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B5678",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  biometricButton: {
    backgroundColor: "#1B5678",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  biometricText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  usePasscodeText: {
    color: "#1B5678",
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: "underline",
  },
  passcodeContainer: {
    width: "100%",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#1B5678",
    backgroundColor: "transparent",
  },
  dotFilled: {
    backgroundColor: "#1B5678",
  },
  dotError: {
    borderColor: "#ff4444",
    backgroundColor: "#ff4444",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    justifyContent: "center",
  },
  key: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderRadius: 40,
    backgroundColor: "rgba(27, 86, 120, 0.1)",
  },
  keyText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1B5678",
  },
});
