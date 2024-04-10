import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Biometrics from "react-native-biometrics";

const BiometricAuthPage = () => {
  const handleBiometricAuth = async () => {
    try {
      const { success } = await Biometrics.simplePrompt({
        promptMessage: "Authenticate with Face ID/Touch ID",
      });

      if (success) {
        console.log("Biometric authentication successful");
      } else {
        console.log("Biometric authentication failed");
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Authentication</Text>
      <Text style={styles.subtitle}>Use Face ID or Touch ID to securely log in</Text>

      <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
        <Text style={styles.biometricButtonText}>Authenticate with Biometrics</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#888",
    textAlign: "center",
  },
  biometricButton: {
    backgroundColor: "#2D53D8", 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  biometricButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default BiometricAuthPage;
