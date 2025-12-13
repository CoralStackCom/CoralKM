import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 250,
    height: "100%",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emailScreen: {
    position: "absolute",
    top: 0,
    zIndex: 8,
    width: "100%",
  },
  authScreen: {
    position: "absolute",
    top: 0,
    zIndex: 8,
    width: "100%",
  },
  appScreen: {
    flex: 1,
    overflow: "hidden",
  },
});
