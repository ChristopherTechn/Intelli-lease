import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import profileImage from "../../assets/icon.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyAccountScreen = () => {
  const [accountDetails, setAccountDetails] = useState({
    FirstName: "",
    LastName: "",
    UserEmail: ""
  });

  const getInfoFromStorage = async () => {
    try {
      const FirstName = await AsyncStorage.getItem("FirstName");
      const LastName = await AsyncStorage.getItem("LastName");
      const UserEmail = await AsyncStorage.getItem("UserEmail");

      setAccountDetails({
        FirstName: FirstName || "",
        LastName: LastName || "",
        UserEmail: UserEmail || ""
      });
    } catch (error) {
      console.error("Error retrieving user info from AsyncStorage:", error.message);
    }
  };

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={[styles.userName, { color: "green" }]}>IntelliLease</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>First Name</Text>
          <Text style={styles.infoValue}>{accountDetails.FirstName}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Name</Text>
          <Text style={styles.infoValue}>{accountDetails.LastName}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User Email</Text>
          <Text style={styles.infoValue}>{accountDetails.UserEmail}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 18,
    color: "#888",
  },
  infoContainer: {
    marginTop: 20,
    // marginBottom: 30,
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  infoValue: {
    fontSize: 16,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default MyAccountScreen;
