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
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import logo from "../../assets/app-logo.png";
import { Image } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import geojsonData from "../../assets/ke_crops_size.json";
import data from "../../assets/cropRecommendation.json";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import pieChartImage from "../../assets/pie_chart_image.png";
import tempGraph from "../../assets/tempGraph.png";
import rainGraph from "../../assets/rainGraph.png";
import humidityGraph from "../../assets/humidityGraph.png";
import nitrogenGraph from "../../assets/nitrogenGraph.png";
import phGraph from "../../assets/phGraph.png";
import phosphorousGraph from "../../assets/phosphorousGraph.png";
import potassiumGraph from "../../assets/potassiumGraph.png";
import { useRoute } from "@react-navigation/native";
import distribution from "../../assets/properties_distribution.png";

export default Info = () => {
  const [polygons, setPolygons] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [selectedCropColor, setSelectedCropColor] = useState("red");
  const [selectedCropClass, setSelectedCropClass] = useState(null);
  const route = useRoute();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [threshold, setThreshold] = useState(10);

  const [pieChartTitle, setPieChartTitle] = useState(
    "Crop classes and their distribution"
  );
  const [lineChartTitle, setLineChartTitle] = useState(
    "Visual of Arable land Areas and crops grown"
  );
  const [barTempChartTitle, setBarTempChartTitle] = useState(
    "Temperature Data Visualization for crop type"
  );
  const [barHumidChartTitle, setBarHumidChartTitle] = useState(
    "Humidity Data Visualization for crop type"
  );
  const [barPHChartTitle, setBarPHChartTitle] = useState(
    "PH Data Visualization for crop type"
  );
  const [barPhosphorousChartTitle, setBarPhosphorousChartTitle] = useState(
    "Phosphorous Data Visualization for crop type"
  );
  const [barPotassiumChartTitle, setBarPotassiumChartTitle] = useState(
    "Potassium Data Visualization for crop type"
  );
  const [barNitrogenChartTitle, setBarNitrogenChartTitle] = useState(
    "Nitrogen Data Visualization for crop type"
  );
  const [barChartTitle, setBarChartTitle] = useState(
    "Rainfall Data Visualization for crop type"
  );

  useEffect(() => {
    try {
      const validPolygons = geojsonData
        .filter(
          (feature) =>
            feature &&
            feature.geometry &&
            (!selectedCropClass || feature.CODE1 === selectedCropClass)
        )
        .map((feature, index) => {
          if (!feature || !feature.AREA_SQKM_) {
            console.error(`Invalid data at index ${index}:`, feature);
            return null;
          }

          const coordinates = feature.geometry.coordinates.map((point) => ({
            latitude: point[1],
            longitude: point[0],
          }));

          return {
            coordinates,
          };
        });

      setPolygons(validPolygons);
    } catch (error) {
      console.error("Error processing data:", error);
    }
  }, [geojsonData, selectedCropClass]);

  const handlePickerChange = (itemValue) => {
    setSelectedCrop(itemValue);
    setSelectedCropClass(itemValue);
    setSelectedCropColor(itemValue ? "red" : "rgba(131, 167, 234, 1)");
    setThreshold(10);

    setPieChartTitle(
      `Crop classes and their distribution - ${itemValue || "All Crops"}`
    );
    setLineChartTitle(
      `Visual of Arable land Areas and crops grown - ${
        itemValue || "All Crops"
      }`
    );
    setBarTempChartTitle(
      `Temperature Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarHumidChartTitle(
      `Humidity Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarPotassiumChartTitle(
      `Potassium Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarPhosphorousChartTitle(
      `Phosphorous Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarPHChartTitle(`PH Data Visualization for ${itemValue || "All Crops"}`);
    setBarNitrogenChartTitle(
      `Nitrogen Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarChartTitle(
      `Rainfall Data Visualization for ${itemValue || "All Crops"}`
    );
  };

  const uniqueCropClasses = Array.from(new Set(data.map((item) => item.label)));

  useEffect(() => {
    const labelPopulations = {};
    data.forEach((item) => {
      const label = item.label;
      const population = item.N + item.P + item.K;

      if (labelPopulations[label]) {
        labelPopulations[label] += population;
      } else {
        labelPopulations[label] = population;
      }
    });

    const transformedData = Object.keys(labelPopulations).map((label) => ({
      name: label,
      population: labelPopulations[label],
      color: getRandomColor(),
    }));

    setPieData(transformedData);
  }, [data]);

  const getRandomColor = () => {
    const colors = [
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF336A",
      "#33B8FF",
      "#FF6347",
      "#00FFFF",
      "#8A2BE2",
      "#7FFF00",
      "#FF7F50",
      "#ADFF2F",
      "#800000",
      "#DC143C",
      "#FFA500",
      "#FFD700",
      "#B22222",
      "#4682B4",
      "#8B008B",
      "#FF69B4",
      "#4B0082",
      "#00FF7F",
      "#FF1493",
      "#00CED1",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const filteredData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;

  const labels = filteredData.slice(-threshold).map((item) => item.label);
  const rainfallData = filteredData
    .slice(-threshold)
    .map((item) => item.rainfall);

  const barData = {
    labels: labels,
    datasets: [
      {
        data: rainfallData,
      },
    ],
  };

  const filteredTempData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const tempLabels = filteredTempData
    .slice(0, threshold)
    .map((item) => item.label);
  const tempData = filteredTempData
    .slice(0, threshold)
    .map((item) => item.temperature);
  const barTempData = {
    labels: tempLabels,
    datasets: [
      {
        data: tempData,
      },
    ],
  };

  const filteredHumidityData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const humidityLabels = filteredHumidityData
    .slice(0, threshold)
    .map((item) => item.label);
  const humidityData = filteredHumidityData
    .slice(0, threshold)
    .map((item) => item.humidity);
  const barHumidityData = {
    labels: humidityLabels,
    datasets: [
      {
        data: humidityData,
      },
    ],
  };

  const filteredPhosphorousData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const phosphorousLabels = filteredPhosphorousData
    .slice(0, threshold)
    .map((item) => item.label);
  const phosphorousData = filteredPhosphorousData
    .slice(0, threshold)
    .map((item) => item.K);
  const barPhosphorousData = {
    labels: phosphorousLabels,
    datasets: [
      {
        data: phosphorousData,
      },
    ],
  };

  const filteredPHData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const PHLabels = filteredPHData.slice(0, threshold).map((item) => item.label);
  const PHData = filteredPHData.slice(0, threshold).map((item) => item.ph);
  const barPHData = {
    labels: PHLabels,
    datasets: [
      {
        data: PHData,
      },
    ],
  };

  const filteredNitrogenData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const nitrogenLabels = filteredNitrogenData
    .slice(0, threshold)
    .map((item) => item.label);
  const nitrogenData = filteredNitrogenData
    .slice(0, threshold)
    .map((item) => item.N);
  const barNitrogenData = {
    labels: nitrogenLabels,
    datasets: [
      {
        data: nitrogenData,
      },
    ],
  };

  const filteredPotassiumData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const potassiumLabels = filteredPotassiumData
    .slice(0, threshold)
    .map((item) => item.label);
  const potassiumData = filteredPotassiumData
    .slice(0, threshold)
    .map((item) => item.K);
  const barPotassiumData = {
    labels: potassiumLabels,
    datasets: [
      {
        data: potassiumData,
      },
    ],
  };
  return (
    <>
      <Text style={[styles.subTextSmall, { marginTop: "-5%" }]}>
        Distribution of crop data in the training data
      </Text>
      <Image source={pieChartImage} style={styles.image}></Image>
      <Text style={styles.subTextSmall}>Properties' Distribution</Text>
      <Image source={distribution} style={styles.image1}></Image>
      <Text style={styles.subTextSmall}>{barTempChartTitle}</Text>
      {selectedCrop ? (
        <BarChart
          data={barTempData}
          width={Dimensions.get("window").width * 0.96}
          height={320}
          chartConfig={{
            backgroundColor: "fb8c00",
            backgroundGradientFrom: "green",
            backgroundGradientTo: "#71f075",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15,
            },
            showXAxisLabel: false,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: 10,
            marginBottom: 25,
          }}
        />
      ) : (
        <Image
          source={tempGraph}
          style={[styles.image, { objectFit: "contain" }]}
        />
      )}

      <Text style={styles.subTextSmall}>{barChartTitle}</Text>
      {selectedCrop ? (
        <BarChart
          data={barData}
          width={Dimensions.get("window").width * 0.96}
          height={320}
          chartConfig={{
            backgroundColor: "fb8c00",
            backgroundGradientFrom: "green",
            backgroundGradientTo: "#71f075",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15,
            },
            showXAxisLabel: false,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: 10,
            marginBottom: 25,
          }}
        />
      ) : (
        <Image
          source={rainGraph}
          style={[styles.image, { objectFit: "contain" }]}
        />
      )}
      <Text style={styles.subTextSmall}>{barHumidChartTitle}</Text>
      {selectedCrop ? (
        <BarChart
          data={barHumidityData}
          width={Dimensions.get("window").width * 0.96}
          height={320}
          chartConfig={{
            backgroundColor: "fb8c00",
            backgroundGradientFrom: "green",
            backgroundGradientTo: "#71f075",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15,
            },
            showXAxisLabel: false,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: 10,
            marginBottom: 25,
          }}
        />
      ) : (
        <Image
          source={humidityGraph}
          style={[styles.image, { objectFit: "contain" }]}
        />
      )}
      <Text style={styles.subTextSmall}>{barPotassiumChartTitle}</Text>
      {selectedCrop ? (
        <BarChart
          data={barPotassiumData}
          width={Dimensions.get("window").width * 0.96}
          height={320}
          chartConfig={{
            backgroundColor: "fb8c00",
            backgroundGradientFrom: "green",
            backgroundGradientTo: "#71f075",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15,
            },
            showXAxisLabel: false,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: 10,
            marginBottom: 25,
          }}
        />
      ) : (
        <Image
          source={potassiumGraph}
          style={[styles.image, { objectFit: "contain" }]}
        />
      )}
      <Text style={styles.subTextSmall}>{barPHChartTitle}</Text>
      {selectedCrop ? (
        <BarChart
          data={barPHData}
          width={Dimensions.get("window").width * 0.96}
          height={320}
          chartConfig={{
            backgroundColor: "fb8c00",
            backgroundGradientFrom: "green",
            backgroundGradientTo: "#71f075",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15,
            },
            showXAxisLabel: false,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: 10,
            marginBottom: 25,
          }}
        />
      ) : (
        <Image
          source={phGraph}
          style={[styles.image, { objectFit: "contain" }]}
        />
      )}
      <Text style={styles.subTextSmall}>{barNitrogenChartTitle}</Text>
      {selectedCrop ? (
        <BarChart
          data={barNitrogenData}
          width={Dimensions.get("window").width * 0.96}
          height={320}
          chartConfig={{
            backgroundColor: "fb8c00",
            backgroundGradientFrom: "green",
            backgroundGradientTo: "#71f075",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15,
            },
            showXAxisLabel: false,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: 10,
            marginBottom: 25,
          }}
        />
      ) : (
        <Image
          source={nitrogenGraph}
          style={[styles.image, { objectFit: "contain" }]}
        />
      )}
      <Text style={styles.subTextSmall}>{barPhosphorousChartTitle}</Text>
      {selectedCrop ? (
        <BarChart
          data={barPhosphorousData}
          width={Dimensions.get("window").width * 0.96}
          height={320}
          chartConfig={{
            backgroundColor: "fb8c00",
            backgroundGradientFrom: "green",
            backgroundGradientTo: "#71f075",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 15,
            },
            showXAxisLabel: false,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: 10,
            marginBottom: 25,
          }}
        />
      ) : (
        <Image
          source={phosphorousGraph}
          style={[styles.image, { objectFit: "contain" }]}
        />
      )}
    </>
  );
};

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
    width: 350,
    height: 350,
    resizeMode: "cover",
    marginLeft: 5,
    marginRight:5
  },
  image1: {
    width: 400,
    height: 450,
    resizeMode: "contain",
    marginLeft: 10,
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
