import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 10,
    elevation: 10,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  completeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
