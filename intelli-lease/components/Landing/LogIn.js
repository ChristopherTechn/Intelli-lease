import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../AuthContext";
import jwtDecode from "jwt-decode";
import { ActivityIndicator } from "react-native-paper";

export default function LogIn({ onSwitchToSignUp }) {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    UserEmail: "",
    UserPasswordHash: "",
  });

  const navigateToHome = (userEmail, userRole, responseData) => {
    console.log("User object before login:", { username: userEmail });
    login({ username: userEmail }, userRole);
    console.log("Navigating to WelcomeUserHomeTab with UserEmail:", userEmail);
    navigation.navigate("WelcomeUserHomeTab", {
      screen: "Home",
    });
  };

  const handleLogIn = async () => {
    try {
      const response = await fetch("https://intelli-lease-v1.onrender.com/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Status Text:", response.statusText);

      const responseData = await response.json();
      console.log("response data", responseData);

      if (!response.ok) {
        const errorMessage =
          responseData.error || "Invalid username or password";
        throw new Error(errorMessage);
      }

      const token = responseData.token;
      console.log("token", token);

      if (!token) {
        throw new Error("Token not found in response");
      }

      const userEmail = responseData?.user?.UserEmail;
      if (!userEmail) {
        throw new Error("User email not found in response");
      }

      setForm({ UserEmail: "", UserPasswordHash: "" });

      const storeParamsData = async (
        UserEmail,
        FirstName,
        LastName,
        UserID,
        token
      ) => {
        try {
          await AsyncStorage.setItem("FirstName", FirstName);
          await AsyncStorage.setItem("LastName", LastName);
          await AsyncStorage.setItem("UserEmail", UserEmail);
          await AsyncStorage.setItem("UserID", UserID);
          await AsyncStorage.setItem("token", token);
        } catch (e) {
          console.error(`Failed to store params value in AsyncStorage: ${e}`);
        }
      };

      storeParamsData(
        responseData.user.UserEmail,
        responseData.user.FirstName,
        responseData.user.LastName,
        responseData.user.UserID,
        responseData.token
      );

      const userRole = userEmail.toLowerCase().includes("admin")
        ? "admin"
        : "user";
      const user = { username: userEmail };
      login(user);

      Alert.alert("LogIn successful", "User logged in successfully", [
        {
          text: "OK",
          onPress: () => navigateToHome(userEmail, userRole, responseData),
        },
      ]);
    } catch (error) {
      console.error("Error signing in:", error.message);
      const message = error.message || "Invalid username or password";
      Alert.alert("LogIn failed", message);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Log in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(UserEmail) => setForm({ ...form, UserEmail })}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.UserEmail}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              autoCorrect={false}
              onChangeText={(UserPasswordHash) =>
                setForm({ ...form, UserPasswordHash })
              }
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.UserPasswordHash}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogIn}>
              <View style={styles.btn}>
              {loading? (<ActivityIndicator/>):(<Text style={styles.btnText}>Login</Text>)}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.switchButton}>
            <Text style={{ color: "black" }}>
              Don't have an account?{" "}
              <Text
                onPress={onSwitchToSignUp}
                style={{ textDecorationLine: "underline", color: "green" }}
              >
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    margin: 24,
  },
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  logo: {
    marginLeft: "5%",
    marginTop: "14%",
    fontSize: 22,
    marginBottom: "-3%",
    color: "#ccc",
  },
  header: {
    marginVertical: 36,
  },
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    marginTop: "-5%",
    textAlign: "center",
  },
  input: {
    marginBottom: 26,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "green",
    borderColor: "green",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
