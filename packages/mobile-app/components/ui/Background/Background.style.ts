import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
    zIndex: 1,
  },
  sky: {
    zIndex: -1,
  },
  stars: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  sun: {
    position: "absolute",
    width: 120,
    height: 120,
    top: 40,
    left: width / 2 - 60,
  },
  land: {
    zIndex: -1,
  },
  mountainsLeft: {
    position: "absolute",
    width: 180,
    height: 120,
    bottom: 60,
    left: 0,
  },
  mountainsRight: {
    position: "absolute",
    width: 180,
    height: 120,
    bottom: 60,
    right: 0,
  },
  underwater: {
    zIndex: -1,
  },
});
