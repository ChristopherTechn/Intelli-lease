import React from "react";
import { StyleSheet, ScrollView } from "react-native";
export default function SettingsScreen({}) {
  return <ScrollView style={[styles.container]}></ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    paddingVertical: 10,
  },
});
