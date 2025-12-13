import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    maxHeight: height,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  content: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "transparent",
  },
  bubbleContainer: {
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  stepContainer: {
    position: "relative",
    minHeight: 300,
  },
  step: {
    width: "100%",
  },
});
