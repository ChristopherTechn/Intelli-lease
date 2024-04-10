import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import logo from "../../assets/app-logo.png";
import { Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";


export default function LandingPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const navigation = useNavigation();

  const switchToSignUp = () => {
    setShowLogin(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <ScrollView>
      <View style={{marginTop:'3%'}}>
        <Image
          source={logo}
          style={{
            width: 400,
            height: 100,
            borderRadius: 50,
            marginLeft:'0%',
            marginTop:'2%',
            alignItems:'center',
            resizeMode: "cover",
          }}
        />
      </View>
      <View style={styles.container}>
        {showLogin ? (
          <LogIn onSwitchToSignUp={switchToSignUp} />
        ) : (
          <SignUp onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </View>
      {!showLogin && (
        <TouchableOpacity style={styles.switchButton}>
          <Text style={{ color: "black" }}>
            Already have an account?{" "}
            <Text
              onPress={() => setShowLogin(true)}
              style={{ textDecorationLine: "underline", color: "green" }}
            >
              Log In
            </Text>
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
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
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
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
  switchButton: {
    marginTop: "180%",
    marginLeft: "7%",
    position: "absolute",
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
