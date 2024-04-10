import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import data from "../../assets/ke.json";
import { useState, useEffect } from "react";
import _debounce from "lodash.debounce";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "react-native-paper";
import logo from "../../assets/app-logo.png";
import homeImg from "../../assets/surveyor1.png";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Home() {
  const route = useRoute()
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [isPlacesClicked, setIsPlacesClicked] = useState(true);
  const [selectedText, setSelectedText] = useState("Places");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)

  const user = route.params && route.params.user;
  // console.log(route.params);

  
  const debouncedSearch = _debounce((text) => {
    const newData = data.filter((county) =>
      county.admin_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(newData);
  }, 100);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleLeaseClick = () => {
    navigation.navigate("AdminHome");
  };

  const handlePlacesClick = () => {
    setSelectedText("Places");
    setIsPlacesClicked(true);
  };

  const handleLandforLeaseClick = () => {
    setSelectedText("Available Land for Lease");
    setIsPlacesClicked(false);
  };

  const handleCountyNameClick = (countyName) => {

    Alert.alert(
      null,
      `You are about to view land available for lease in ${countyName}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Take me there",
          style: { color: "green", fontWeight: "normal" },
          onPress: () => {
            navigation.navigate("LandForLease", {countyName});
          },
        },
      ]
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <View style={styles.topBar}>
            <View>
              <Image
                source={logo}
                style={{
                  width: 200,
                  height: 100,
                  borderRadius: 50,
                  marginLeft: "-8%",
                  alignItems: "center",
                  marginTop: "2%",
                  marginBottom: "-8%",
                  resizeMode: "cover",
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                marginTop: "10%",
                marginBottom: "4%",
                marginLeft: "8%",
                height: "40px",
              }}
              onPress={() => navigation.navigate("LeaseLand")}
              >
              <Button
                style={[
                  styles.rowText,
                  {
                    backgroundColor: "green",
                  },
                ]}
              >
                <Text
                  style={{
                    color: "white",
                    marginTop: "-1%",
                    fontWeight: "400",
                  }}
                >
                  Lease Out Land
                </Text>
              </Button>
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>
            Let's find you the best land for leasing
          </Text>

          <View>
              <Image
                source={homeImg}
                style={{
                  width: 450,
                  height: 250,
                  marginLeft: "0%",
                  alignItems: "center",
                  marginTop: "2%",
                  marginBottom: "4%",
                  resizeMode: "cover",
                  position:'relative'
                }}
              />
            </View>
          <View style={styles.subTextRow}>
            {[
              { text: "Places", onPress: handlePlacesClick },
              {
                text: "Available Land for Lease",
                onPress: handleLandforLeaseClick,
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
                      borderBottomColor: selectedText === text ? "green": "transparent",
                      borderBottomWidth: selectedText === text ? 3 : 0
                    },
                  ]}
                >
                  {text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by county name"
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
          />
          {isPlacesClicked ? (
            <View style={styles.countyView}>
              {filteredData.map((county, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.row}
                  onPress={() => {
                    navigation.navigate("Analytics", {
                      place: county.admin_name,
                      latitude: parseFloat(county.lat),
                      longitude: parseFloat(county.lng),
                      fromHome: true,
                    });
                  }}
                >
                  <Text style={styles.rowText}>{county.admin_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.countyView}>
              {filteredData.map((county, index) => (
                <>
                  <TouchableOpacity
                    key={index}
                    style={styles.row}
                    onPress={() => handleCountyNameClick(county.city)}
                  >
                    <Text style={styles.rowText}>{county.admin_name}</Text>
                  </TouchableOpacity>
                </>
              ))}
            </View>
          )}
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    display: "flex",
    flexDirection: "row",
    gap: 25, 
    margin: "1%",
    marginTop: "3%",
    borderRadius: 25,
  },  
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
    marginTop: "4%",
    fontSize: 22,
    marginBottom: "8%",
    color: "#ccc",
  },
  text: {
    marginLeft: "9%",
    marginRight: '4%',
    marginTop: "54%",
    fontSize: 28, 
    color: "white",
    zIndex: 999,
    letterSpacing: 0.4,
    position: 'absolute',
    marginBottom: "10%",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },  
  
  subText: {
    marginLeft: "15%",
    marginTop: "5%",
    fontSize: 16,
    fontWeight: 300,
    color: "green",
    marginBottom: "18%",
    color: "#000",
  },
  subTextRow: {
    flexDirection: "row",
    marginLeft: "8%",
    alignItems: 'center',
    marginBottom: "2%", 
  },
  searchInput: {
    height: 40,
    borderColor: "#f1f5f9",
    marginTop:'2%',
    borderWidth: 2,
    marginLeft: "5%",
    marginRight: "8%",
    paddingLeft: "5%",
    borderRadius: 18,
    marginBottom: "15%",
  },
  countyView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 24,
  },
  row: {
    flexBasis: "27%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: '3%',
    borderWidth: 2,
    borderColor: "#f1f5f9",
    marginRight: '3%',
    borderRadius: 25,
  },
  rowText: {
    color: "green",
  },
});
