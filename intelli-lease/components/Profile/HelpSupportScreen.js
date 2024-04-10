import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import supportImage from "../../assets/icon.png";

const HelpAndSupportPage = () => {
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = () => {
    Alert.alert("Message Sent", `Your message has been sent:\n${userMessage}`);
  };

  return (
    <View style={styles.container}>
      <Image source={supportImage} style={styles.supportImage} />
      <Text style={[styles.title, { color: "green" }]}>Help and Support</Text>
      <Text style={styles.description}>
        If you have any questions or need assistance, our support team is here to help! Reach out to us through the following channels:
      </Text>
      <Text style={styles.contactInfo}>
        Email: support@intelli-lease.com
      </Text>
      <Text style={styles.contactInfo}>
        Phone: 0700 123-4567
      </Text>
      <Text style={styles.contactInfo}>
        Live Chat: Visit our website for live chat support
      </Text>
      <Text style={styles.note}>
        Our support team is available Monday to Friday, 9 AM - 5 PM.
      </Text>
      <TextInput
        style={styles.messageInput}
        placeholder="Leave a message for developers"
        multiline
        numberOfLines={4}
        value={userMessage}
        onChangeText={(text) => setUserMessage(text)}
      />
      <TouchableOpacity style={styles.sendMessageButton} onPress={handleSendMessage}>
        <Text style={styles.sendMessageButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  supportImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },
  contactInfo: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
  },
  note: {
    fontSize: 14,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
  messageInput: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    marginTop: 20
  },
  sendMessageButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  sendMessageButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HelpAndSupportPage;
