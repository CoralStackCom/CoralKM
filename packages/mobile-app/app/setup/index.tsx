import { ThemedView } from "@/components/others/themed-view";
import { Background } from "@/components/ui/Background";
import { SetupScreen } from "@/components/ui/SetupScreen";
import React from "react";

/**
 * Home screen component with setup interface and background
 */
export default function HomeScreen() {
  // Render
  return (
    <ThemedView style={{ flex: 1 }}>
      <Background view="sky" />
      <SetupScreen />
    </ThemedView>
  );
}
