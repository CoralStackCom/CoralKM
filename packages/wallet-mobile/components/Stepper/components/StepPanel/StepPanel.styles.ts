import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 16,
    minWidth: 150,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#1B5678",
    flex: 1,
    maxWidth: 300,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
