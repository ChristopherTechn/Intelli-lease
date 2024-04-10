import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const TwoFactorAuthPage = () => {
  const [verificationCode, setVerificationCode] = useState("");

  const onVerificationSuccess = () => {
    console.log("Verified")
  }

  const handleVerification = () => {
    const isCodeCorrect = verificationCode === "123456"; 

    if (isCodeCorrect) {
      onVerificationSuccess();
    } else {
      alert("Incorrect verification code. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>Enter the verification code sent to your device</Text>

      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        keyboardType="numeric"
        value={verificationCode}
        onChangeText={(text) => setVerificationCode(text)}
      />

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerification}>
        <Text style={styles.verifyButtonText}>Verify</Text>
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
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  verifyButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TwoFactorAuthPage;
