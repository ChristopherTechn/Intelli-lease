import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import sample1 from "../../assets/sample1.jpg";
import sample2 from "../../assets/istockphoto-1468184902-1024x1024.jpg";
import sample3 from "../../assets/istockphoto-1292399669-1024x1024.jpg";
import { ActivityIndicator, Button } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminLandListings() {
  const navigation = useNavigation();
  const [details, setDetails] = useState({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI0MTUwQ0UwRC1FMjg1LTQ2RDMtOUJDRC1GRTdGN0Q0RjY5RjAiLCJpYXQiOjE3MTIwNzk3NzAsImV4cCI6MTcxNDY3MTc3MH0.gMC0zEXLFIwkRQQbzjoz6gE-cHpwUeUo9yvEwcrwo8M",
  });
  const [loading, setLoading] = useState(true)

  const [landDetails, setLandDetails] = useState([]);
  // useEffect(() => {
    // const getUserData = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem("token");
    //     setDetails((prevDetails) => ({ ...prevDetails, token: token }));
    //   } catch (error) {
    //     console.error(
    //       "Error retrieving user data from AsyncStorage:",
    //       error.message
    //     );
    //   }
    // };
    // getUserData();
  // }, []);

  const viewPendingLeaseRequests = async () => {
    try {

      setLoading(true)
      const response = await fetch(
        "https://intelli-lease-v1-1.onrender.com/view-pending-lease-requests",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": details.token,
          },
          // body: JSON.stringify(details),
        }
      );
      if (!response.ok) {
        console.error(
          "Error admin viewing pending lease requests:",
          response.status
        );
        return;
      }

      const responseData = await response.json();
      setLandDetails(responseData.results);
    } catch (error) {
      console.error(
        "Error admin viewing pending lease requests:",
        error.message
      );
    }finally{
      setLoading(false)
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      viewPendingLeaseRequests();
    }, [])
  );

  const handleAssess = async (item) => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem("selectedLand", JSON.stringify(item));
      navigation.navigate("AdminLandReport");
    } catch (error) {
      console.error("Error updating AsyncStorage:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {landDetails.map((item) => (
        <View key={item.LeaseLandDataID} style={styles.button}>
          <Image style={styles.image} source={sample1} />
          <Text style={styles.buttonText}>{item.CountyName}</Text>
          <Text style={styles.buttonSubText}>{item.SubCountyName}</Text>
          <Text style={styles.buttonSubText}>{item.ConstituencyName}</Text>
          <Text style={styles.buttonSubText}>{item.isApproved}</Text>
          <Text style={styles.buttonSubText}>{item.timeStamp}</Text>
          <TouchableOpacity>
            <Button
              style={styles.leaseButton}
              onPress={() => handleAssess(item)}
            >
              <Text style={{ color: "green" }}>Assess</Text>
            </Button>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "green",
    width: "90%",
    paddingBottom: 25,
    marginBottom: 35,
    borderRadius: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 2,
    paddingTop: 2,
  },
  buttonSubText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "lighter",
    // marginBottom: 5,
    marginTop: 5,
  },
  leaseButton: {
    backgroundColor: "white",
    color: "green",
    marginTop: 20,
  },
});
