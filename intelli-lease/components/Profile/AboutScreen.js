import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import wearableImage from "../../assets/icon.png";

const AboutPage = () => {
  return (
    <View style={styles.container}>
      <Image source={wearableImage} style={styles.wearableImage} />
      <Text style={[styles.title,  {color: "green"}]}>Intelli-Lease</Text>
      <Text style={styles.description}>
      Introducing our Intelligent Land Leasing System, a cutting-edge platform designed to revolutionize the way land transactions are managed. This innovative solution combines advanced technology with a user-friendly interface, providing a seamless and efficient experience for landowners, tenants, and stakeholders involved in the leasing process.
      </Text>
      <Text style={[styles.featuresTitle, {color: "green"}]}>Key Features:</Text>
      <Text style={styles.featuresList}>
        -  Our system employs a sophisticated matching algorithm that analyzes various parameters, such as location, size, and land characteristics, to connect landowners with potential tenants. This ensures optimal land-use compatibility and maximizes mutual benefits.
      </Text>
      <Text style={styles.featuresList}>
        -  Facilitating transparent communication, our platform enables landowners and tenants to negotiate terms openly. Real-time updates and notifications keep all parties informed, fostering trust and collaboration throughout the leasing process.
      </Text>
      <Text style={styles.featuresList}>
        -  Harnessing the power of data analytics, our system provides valuable insights into market trends, pricing dynamics, and historical transaction data. Users can make informed decisions based on this data, optimizing their leasing strategies for maximum profitability.
      </Text>
      <Text style={styles.featuresList}>
        - Streamlining the paperwork, our system automates the documentation process, ensuring that all agreements adhere to legal requirements and compliance standards. This reduces the risk of disputes and accelerates the overall leasing timeline.
      </Text>
      <Text style={styles.featuresList}>
        - Designed with simplicity in mind, our intuitive user interface ensures that both experienced and novice users can navigate the platform effortlessly. From listing a property to finalizing a lease agreement, the entire process is user-friendly and efficient.
      </Text>
      <Text style={styles.featuresList}>
        - Our Intelligent Land Leasing System is scalable to accommodate various sizes of land transactions, from small parcels to extensive agricultural or commercial properties. Additionally, the platform is customizable to meet the unique requirements of different industries and geographical regions.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor:"#FFF"
  },
  wearableImage: {
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
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  featuresList: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
  },
});

export default AboutPage;
