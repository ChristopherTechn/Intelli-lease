import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import homeImg from "../../assets/admin.png";
import { Image } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function AdminHome() {

  const navigation = useNavigation()
  const handleLandListings = () => {
    navigation.navigate("AdminHomeLandListing")
  }
  return (
    <View style={styles.container}>
       <View>
              <Image
                source={homeImg}
                style={{
                  width: 350,
                  height: 350,
                  alignItems: "center",
                  marginBottom: "4%",
                  resizeMode: "cover",
                  position:'relative'
                }}
              />
            </View>
      <Text style={styles.title}>Land Leasing Admin Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={handleLandListings}>
        <Text style={styles.buttonText} >Pending Land Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AdminAllUsers")}>
        <Text style={styles.buttonText}>View Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green', 
  },
  button: {
    backgroundColor: 'green', 
    padding: 15,
    width: '80%',
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

