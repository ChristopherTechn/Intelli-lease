import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminLandReport = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [selectedLandDetails, setSelectedLandDetails] = useState({
    LeaseLandDataID: "",
    UserID: "",
    CountyName: "",
    SubCountyName: "",
    ConstituencyName: "",
    LandSize: "",
    timeStamp: "",
    isApproved: "",
    isDeleted: "",
  });
  const [UserDetails, setUserDetails] = useState({
    UserID: "",
    FirstName: "",
    LastName: "",
    UserEmail: "",
    UserPasswordHash: "",
  });
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI0MTUwQ0UwRC1FMjg1LTQ2RDMtOUJDRC1GRTdGN0Q0RjY5RjAiLCJpYXQiOjE3MTIwNzk3NzAsImV4cCI6MTcxNDY3MTc3MH0.gMC0zEXLFIwkRQQbzjoz6gE-cHpwUeUo9yvEwcrwo8M",
    );

  const [remarks, setRemarks] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const details = await AsyncStorage.getItem("selectedLand");
        const tok = await AsyncStorage.getItem("token");
        if (details) {
          setSelectedLandDetails(JSON.parse(details));
        }
        if (tok) {
          setToken(tok);
        }
          setLoading(false);
      } catch (error) {
        console.error(
          "Error retrieving user data from AsyncStorage:",
          error.message
        );
      }
    };

    getUserData();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await fetch("https://intelli-lease-v1-1.onrender.com/getUserDetails", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ UserID: selectedLandDetails.UserID }),
      });
      if (!response.ok) {
        console.error("Error getting user details:", response.status);
        return;
      }

      const responseData = await response.json();
      setUserDetails(responseData.results[0]);
    } catch (error) {
      console.error("Error getting user details:", error.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [token, selectedLandDetails]);

  const approveLeaseRequest = async () => {
    const data = {
      userID: selectedLandDetails.UserID,
      LeaseLandDataID: selectedLandDetails.LeaseLandDataID
    };
    try {
      const response = await fetch(
        "https://intelli-lease-v1-1.onrender.com/approve-lease-request",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        console.error("Error approving lease request:", response.status);
        return;
      }

      const responseData = await response.json();

      Alert.alert("Success!", "You have approved this land for lease", [
        {
          text: "OK",
          onPress: () => navigation.navigate("AdminHomeLandListing"),
        },
      ]);
    } catch (error) {
      console.error("Error approving lease request:", error.message);
    }
  };

  const declineLeaseRequest = async () => {
    const data = {
      userID: selectedLandDetails.UserID, // Corrected field name
      LeaseLandDataID: selectedLandDetails.LeaseLandDataID,
    };
    try {
      const response = await fetch(
        "https://intelli-lease-v1-1.onrender.com/decline-lease-request",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        console.error("Error declining lease request:", response.status);
        return;
      }
  
      const responseData = await response.json();
      console.log(responseData); 
  
      Alert.alert("Success!", "You have declined this land for lease", [
        {
          text: "OK",
          onPress: () => navigation.navigate("AdminHomeLandListing"),
        },
      ]);
    } catch (error) {
      console.error("Error declining lease request:", error.message);
    }
  };  
  
  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Remarks</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            onChangeText={(text) => setRemarks(text)} // Update remarks state
            placeholder="Enter remarks here"
            placeholderTextColor="#6b7280"
            style={[styles.inputControl, { height: 200 }]}
            value={remarks} // Bind value to remarks state
          />
          <Text style={styles.inputLabel}>Verdict</Text>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.approveButton}
              labelStyle={{ color: "white" }}
              onPress={approveLeaseRequest}
            >
              <Text>Approve</Text>
            </Button>
            <Button style={styles.rejectButton} labelStyle={{ color: "white" }} onPress={declineLeaseRequest}>
              <Text>Reject</Text>
            </Button>
          </View>

          <Text
            style={[styles.inputLabel, { marginTop: 10, marginBottom: 15 }]}
          >
            Land Owner Details
          </Text>
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>
            Personal Details
          </Text>
          <View style={[styles.input, { marginTop: 20 }]}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={UserDetails.FirstName}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={UserDetails.LastName}
            />
          </View>
          <View style={[styles.input]}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={UserDetails.UserEmail}
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>
            Location Details
          </Text>
          <View style={[styles.input]}>
            <Text style={styles.inputLabel}>County Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              defaultValue={selectedLandDetails.CountyName}
              editable={false}
            />
          </View>
          <View style={[styles.input]}>
            <Text style={styles.inputLabel}>Constituency Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              defaultValue={selectedLandDetails.SubCountyName}
              editable={false}
            />
          </View>
          <View style={[styles.input]}>
            <Text style={styles.inputLabel}>Ward Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              defaultValue={selectedLandDetails.ConstituencyName}
              editable={false}
            />
          </View>
          <View style={[styles.input]}>
            <Text style={styles.inputLabel}>Land Size (in Acres)</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              defaultValue={`${selectedLandDetails.LandSize}`}
              editable={false}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    marginTop: 15,
    margin: 18,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 25,
    paddingBottom: 35,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 6,
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
    marginBottom: 25,
    fontWeight: "500",
    color: "#222",
    borderColor: "transparent",
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
  formAction: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  approveButton: {
    backgroundColor: "green",
    color: "white",
    padding: 10,
    borderRadius: 8,
    width: "48%",
  },
  rejectButton: {
    backgroundColor: "red",
    color: "white",
    padding: 10,
    borderRadius: 8,
    width: "48%",
  },
});

export default AdminLandReport;
