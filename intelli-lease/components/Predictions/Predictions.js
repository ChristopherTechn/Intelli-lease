import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import logo from "../../assets/app-logo.png";
import { Image } from "react-native";
import data from "../../assets/cropRecommendation.json";
import { useRoute } from "@react-navigation/native";
import Info from "./info";
import Summary from "./summary";

export default function Predictions() {
  const route = useRoute();
  const [isHistoryClicked, setIsHistoryClicked] = useState(true);
  const [isSummaryClicked, setIsSummaryClicked] = useState(false);
  const [isInfoClicked, setIsInfoClicked] = useState(false);
  const [selectedText, setSelectedText] = useState("History");

  const handleHistoryClick = () => {
    setSelectedText("History");
    setIsHistoryClicked(true);
    setIsInfoClicked(false);
    setIsSummaryClicked(false);
  };

  const handleSummaryClick = () => {
    setSelectedText("Summary");
    setIsHistoryClicked(false);
    setIsInfoClicked(false);
    setIsSummaryClicked(true);
  };

  const handleInfoClick = () => {
    setSelectedText("Info");
    setIsHistoryClicked(false);
    setIsInfoClicked(true);
    setIsSummaryClicked(false);
  };

  const uniqueCropClasses = Array.from(new Set(data.map((item) => item.label)));

  const cropLabelsRow = {
    column1: "Crop Types:",
    column2: uniqueCropClasses.map((cropClass) => cropClass).join("\n"),
  };

  const tableData = [
    { column1: "Parameter", column2: "Metrics" },
    { column1: "Focus Area:", column2: "Kenya" },
    { column1: "Number of Land Features:", column2: "7" },
    { column1: "Number of Crop Types:", column2: "23" },
    {
      column1: "Land Features:",
      column2:
        "Phosphorous Levels\nPotassium Levels\nNitrogen Levels\npH Levels\nRainfall Data\nTemperature Data\nHumidity Data",
    },
    cropLabelsRow,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <View>
            <Image
              source={logo}
              style={{
                width: 400,
                height: 150,
                borderRadius: 50,
                marginLeft: "-22%",
                marginTop: "-4%",
                marginBottom: "-8%",
                resizeMode: "contain",
              }}
            />
          </View>
          <Text
            style={[styles.text, { marginTop: "5%", fontWeight: "lighter" }]}
          >
            Sample of our Predictions
          </Text>
          <View style={styles.subTextRow}>
            {[
              // {
              //   text: "History",
              //   onPress: handleHistoryClick,
              //   marginTop: "3.5%",
              // },
              // {
              //   text: "Summary",
              //   onPress: handleSummaryClick,
              //   marginTop: "3.5%",
              // },
              {
                text: "Info",
                onPress: handleInfoClick,
                marginTop: "3%",
              },
            ].map(({ text, onPress, marginTop }) => (
              <TouchableOpacity
                key={text}
                onPress={onPress}
                style={{ marginTop }}
              >
                <Text
                  style={[
                    styles.subText,
                    {
                      color: selectedText === text ? "green" : "black",
                      borderBottomColor:
                        selectedText === text ? "green" : "transparent",
                      borderBottomWidth: selectedText === text ? 3 : 0,
                    },
                  ]}
                >
                  {text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {isHistoryClicked && (
          <View>
            <Text>History</Text>
          </View>
        )}
        {isSummaryClicked && <Summary data={tableData} />}
        {isInfoClicked && <Info />}
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    paddingBottom: 50,
  },
  logo: {
    marginLeft: "5%",
    marginTop: "14%",
    fontSize: 22,
    marginBottom: "8%",
    color: "#ccc",
  },
  text: {
    marginLeft: "4%",
    fontSize: 38,
    color: "green",
    fontWeight: "lighter",
    marginBottom: "5%",
  },
  subText: {
    marginLeft: "4%",
    fontSize: 30,
    fontWeight: "300",
    color: "green",
    marginBottom: "10%",
  },
  subTextSmall: {
    marginLeft: "4%",
    marginRight: "4%",
    fontSize: 28,
    fontWeight: "300",
    color: "green",
    marginTop: "5%",
    marginBottom: "3%",
  },
  searchInput: {
    height: 40,
    borderColor: "#E2F6E9",
    borderWidth: 2,
    marginLeft: "5%",
    marginRight: "5%",
    paddingLeft: "5%",
    borderRadius: 18,
    marginBottom: "10%",
  },
  countyView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 24,
  },
  row: {
    flexBasis: "28.33%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    border: "none",
    marginRight: 22,
    borderRadius: 25,
    backgroundColor: "#E2F6E9",
  },
  rowText: {
    color: "green",
  },
  subText: {
    marginLeft: "4%",
    fontSize: 30,
    fontWeight: "300",
    color: "green",
    marginBottom: "5%",
  },
  subTextSmall: {
    marginLeft: "4%",
    marginRight: "4%",
    fontSize: 28,
    fontWeight: "300",
    color: "green",
    marginTop: "10%",
    marginBottom: "3%",
  },
  map: {
    backgroundColor: "#E2F6E9",
    height: 405,
    width: "100%",
    marginBottom: "5%",
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "#E2F6E9",
    borderWidth: 2,
    marginLeft: "5%",
    marginRight: "5%",
    paddingLeft: "5%",
    borderRadius: 18,
    marginBottom: "10%",
  },
  countyScrollView: {
    flex: 1,
  },
  countyView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 24,
  },
  row: {
    flexBasis: "28.33%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    border: "none",
    marginRight: 22,
    borderRadius: 25,
    backgroundColor: "#E2F6E9",
  },
  rowText: {
    color: "green",
  },
  picker: {
    height: 50,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  pickerItem: {
    color: "black",
    fontSize: 16,
  },
  image: {
    width: 450,
    height: 450,
    resizeMode: "cover",
    marginLeft: 18,
  },
  image1: {
    width: 450,
    height: 450,
    resizeMode: "contain",
    marginLeft: 18,
  },
  subTextRow: {
    flexDirection: "row",
    marginLeft: "13.5%",
    alignItems: "center",
    marginBottom: "2%",
  },
  subText: {
    marginLeft: "15%",
    marginTop: "5%",
    fontSize: 18,
    fontWeight: 300,
    color: "green",
    marginBottom: "18%",
    color: "#000",
  },
});
