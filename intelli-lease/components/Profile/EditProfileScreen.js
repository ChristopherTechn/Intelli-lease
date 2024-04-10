import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function EditProfileScreen({ navigation }) {

  const handleBackAction = () => {
    navigation.navigate("Profile");
  };
  

  return (
    <View style={[styles.mainContainer]}>
      <AntDesign name="user" style={[styles.icon]} />
      <View>
        <Text style={[styles.name, { fontSize: 24 }]}>UserName</Text>
        <Text style={[styles.name, {marginLeft: "42%"}]}>@username</Text>
      </View>
      <TextInput
        placeholder="What's your first name?"
        style={[styles.input, { marginTop: 20 }]}
      ></TextInput>
      <TextInput
        placeholder="And your last name?"
        style={[styles.input]}
      ></TextInput>
      <TextInput placeholder="New Username" style={[styles.input]}></TextInput>
      <TextInput placeholder="Phone Number" style={[styles.input]}></TextInput>
      <TextInput
        placeholder="Select your gender"
        style={[styles.input]}
      ></TextInput>
      <View style={[styles.button]}>
        <Text
          onPress={handleBackAction}
          style={{
            color: "#FFF",
            alignSelf: "center",
            marginTop: 4,
          }}
        >
          Update Profile
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F5F5F5",
  },
  icon: {
    marginTop: 12,
    color: "#000",
    fontSize: 64,
    marginLeft: "43%",
    color: "green"
  },
  name: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "38%",
    color: "#000",
    marginTop: 8,
  },
  input: {
    padding: 4,
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#FFF",
    underlineColorAndroid: "transparent",
    width: "95%",
    marginLeft: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "green",
    width: "40%",
    height: 48,
    padding: 8,
    marginLeft: "30%",
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 22,
  },
});
