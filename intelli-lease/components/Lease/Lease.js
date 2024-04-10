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
import { Picker } from "@react-native-picker/picker";
import countyData from "../../assets/Kenya_counties_subcounties_constituencies_wards.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";

const LeaseLandPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const[loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    UserEmail: "",
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("UserID");
        const token = await AsyncStorage.getItem("token");
        const firstName = await AsyncStorage.getItem("FirstName");
        const lastName = await AsyncStorage.getItem("LastName");
        const userEmail = await AsyncStorage.getItem("UserEmail");


        setUserData({
          FirstName: firstName || "",
          LastName: lastName || "",
          UserEmail: userEmail || "",
        });

        setDetails({ ...details, UserID: userId });
        setDetails((prevDetails) => ({ ...prevDetails, token: token }));

      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error.message);
      }finally{
        setLoading(false)
      }
    };

    getUserData();
  }, []);

  const [tempDetails, setTempDetails] = useState({
    CountyName: "",
    SubCountyName: ""
  });

  const [details, setDetails] = useState({
    UserID: "",
    CountyName: "",
    SubCountyName: "",
    ConstituencyName: "",
    LandSize: 0,
    token: ""
  });

  const handleLease = async () => {
    try {
      const response = await fetch(
        "https://intelli-lease-v1-1.onrender.com/add-land-leasing-details",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": details.token,
          },
          body: JSON.stringify(details),
        }
      );
      if (!response.ok) {
        console.error("Error Putting Your Land Up for Lease:", response.status);
        return;
      }

      Alert.alert(
        null,
        "Your land is up for lease pending approval. We shall get back to you.",
        [{ text: "OK", onPress: () => navigation.navigate("WelcomeUserHome") }]
      );
    } catch (error) {
      console.error("Error Putting Your Land Up for Lease:", error.message);
    }
  };

  const handleCountyChange = (county) => {
    // console.log("county", county);
    setTempDetails({ ...tempDetails, CountyName: county });
    setDetails({ ...details, CountyName: county.county_name });

  };

  const handleConstituencyChange = (constituency) => {
    // console.log("constituency", constituency);
    setTempDetails({ ...tempDetails, SubCountyName: constituency });
    setDetails({ ...details, SubCountyName: constituency.constituency_name });
  };

  const handleWardChange = (ward) => {
    // console.log("ward", ward);
    setDetails({ ...details, ConstituencyName: ward });
  };

  console.log("details: ", details);


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
              value={userData.FirstName}
              onChangeText={(text) =>
                setUserData({ ...userData, FirstName: text })
              }
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
              value={userData.LastName}
              onChangeText={(text) =>
                setUserData({ ...userData, LastName: text })
              }
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
              value={userData.UserEmail}
              onChangeText={(text) => setUserData({ ...userData, UserEmail })}
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>
            Location Details
          </Text>
          <Picker
            selectedValue={details.CountyName}
            style={styles.inputControl}
            onValueChange={handleCountyChange}
          >
            <Picker.Item label="Select County" value="" />
            {countyData[2].data.map((county) => (
              <Picker.Item
                key={county.county_id}
                label={county.county_name}
                value={county}
                style={styles.pickerItem}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={details.SubCountyName}
            style={styles.inputControl}
            onValueChange={handleConstituencyChange}
          >
            <Picker.Item label="Select Constituency" value="" />
            {countyData[3].data
              .filter((constituency) => constituency.county_id === tempDetails.CountyName.county_id)
              .map((element) =>
              <Picker.Item
                    key={element.constituency_id}
                    label={element.constituency_name}
                    value={element}
                    style={styles.pickerItem}
                  />
                )}
          </Picker>
          <Picker
            selectedValue={details.ConstituencyName}
            style={styles.inputControl}
            onValueChange={handleWardChange}
          >
            <Picker.Item label="Select Ward" value="" />
            {countyData[4].data
              .filter((ward) => ward.subcounty_id === tempDetails.SubCountyName.subcounty_id)
              .map((element) =>
              <Picker.Item
                    key={element.station_id}
                    label={element.ward}
                    value={element.ward}
                    style={styles.pickerItem}
                  />
                )}
          </Picker>
          <Text style={[styles.inputLabel, { marginTop: 20 }]}>
            Land Details
          </Text>
          <View style={[styles.input, { marginTop: 20 }]}>
            <Text style={styles.inputLabel}>Land Size (in Acres)</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              onChangeText={(LandSize) =>
                setDetails({ ...details, LandSize: LandSize.toString() })
              }
              placeholder="0 (ACRES)"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={details.LandSize.toString()} // Convert to string
            />
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLease}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Lease Out Your Land</Text>
              </View>
            </TouchableOpacity>
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
});

export default LeaseLandPage;
