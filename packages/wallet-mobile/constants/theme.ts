/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#1B5678";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#7eadc9",
    background: "#fff",
    surface: "#fff",
    surfaceSecondary: "#F2F2F2",
    tint: tintColorLight,
    icon: "#687076",
    border: "#e0e0e0",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    error: "#ff3b30",
    success: "#34c759",
    warning: "#ff9500",
    headerText: "#b0c2cc",
    cardBackground: "#fff",
    sectionTitle: "#7eadc9",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    background: "#151718",
    surface: "#1E2022",
    surfaceSecondary: "#2A2D2F",
    tint: tintColorDark,
    icon: "#9BA1A6",
    border: "#333",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    error: "#ff453a",
    success: "#30d158",
    warning: "#ff9f0a",
    headerText: "#9BA1A6",
    cardBackground: "#1E2022",
    sectionTitle: "#9BA1A6",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
