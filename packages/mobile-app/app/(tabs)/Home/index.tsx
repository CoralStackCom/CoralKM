import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Home.style";

/**
 * Home page component displaying wallet features and setup process
 */
export default function HomePage() {
  // Render
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to Your Wallet</Text>
        <Text style={styles.subtitle}>Secure, Simple, and easy to use </Text>
      </View>

      {/* Feature Cards */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>
          <Text style={styles.featureTitle}>Secure Setup</Text>
          <Text style={styles.featureDescription}>
            Multi-step setup process with encryption and security built-in
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✨</Text>
          </View>
          <Text style={styles.featureTitle}>Entropy Generator</Text>
          <Text style={styles.featureDescription}>
            Generate secure random seeds with visual feedback
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎨</Text>
          </View>
          <Text style={styles.featureTitle}>Simple UI</Text>
          <Text style={styles.featureDescription}>
            Animated backgrounds and smooth transitions throughout
          </Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <TouchableOpacity style={styles.ctaButton}>
          <LinearGradient
            colors={["#1B5678", "#2C7BA0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How It Works</Text>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Complete the setup Screen</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Generate your secure seed</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Start using the app securely</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
