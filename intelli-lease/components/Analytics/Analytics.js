import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { StatusBar, Dimensions, SafeAreaView, Alert } from "react-native";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import MapView, { Marker, Polygon } from "react-native-maps";
import geojsonData from "../../assets/ke_crops_size.json";
import data from "../../assets/cropRecommendation.json";
import { Picker } from "@react-native-picker/picker";
import logo from "../../assets/app-logo.png";
import Slider from "@react-native-community/slider";
import pieChartImage from "../../assets/pie_chart_image.png";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Analytics() {
  const [polygons, setPolygons] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [selectedCropColor, setSelectedCropColor] = useState("red");
  const [selectedCropClass, setSelectedCropClass] = useState(null);
  const route = useRoute();
  const { place, latitude, longitude, fromHome } = route.params || {};
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [threshold, setThreshold] = useState(10);
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingPhosphorus, setLoadingPhosphorus] = useState(false);
  const [loadingPotassium, setLoadingPotassium] = useState(false);
  const [loadingPH, setLoadingPH] = useState(false);
  const [loadingRainfall, setLoadingRainfall] = useState(false);
  const [loadingTemperature, setLoadingTemperature] = useState(false);
  const [loadingHumidity, setLoadingHumidity] = useState(false);
  const [loadingNitrogen, setLoadingNitrogen] = useState(false);
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingClimateData, setLoadingClimateData] = useState(true);
  const [loadingSoilData, setLoadingSoilData] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(true);
  const [form, setForm] = useState({
    N: 0,
    P: 0,
    K: 0,
    temperature: 0,
    humidity: 0,
    pH: 0,
    rainfall: 0,
  });

  const [formFilled, setFormFilled] = useState(false);

  // Function to check if all form fields are filled
  const checkFormFilled = () => {
    const { N, P, K, temperature, humidity, pH, rainfall } = form;
    return (
      N !== 0 &&
      P !== 0 &&
      K !== 0 &&
      temperature !== 0 &&
      humidity !== 0 &&
      pH !== 0 &&
      rainfall >= 0
    );
  };

  // useEffect to check if all form fields are filled
  useEffect(() => {
    setFormFilled(checkFormFilled());
  }, [form]);

  const handlePredict = async () => {
    setLoadingPrediction(true);
    console.log("form: ", form);
    try {
      // Convert form data to features format
      const features = {
        K: parseFloat(form.K),
        N: parseFloat(form.N),
        P: parseFloat(form.P),
        humidity: parseFloat(form.humidity),
        pH: parseFloat(form.pH),
        rainfall: parseFloat(form.rainfall),
        temperature: parseFloat(form.temperature),
      };

      const response = await axios.post(
        "https://intelli-lease-v1-2.onrender.com/predict",
        { features: features },
        { withCredentials: true }
      );

      console.log("predict: ", response.data);
      setPrediction(response.data);
      const countyPrediction = {
        county: place,
        prediction: response.data,
      };
      await AsyncStorage.setItem(
        "countyPrediction",
        JSON.stringify(countyPrediction)
      );

      if (selectedCrop) {
        const otherClasses = response.data.other_classes;
        const probability = otherClasses[selectedCrop];

        if (probability === 0) {
          Alert.alert("Warning", "This crop might not do well in this area");
          setSelectedCrop("");
        } else {
          const probabilityPercentage = (probability * 100).toFixed(2);
          Alert.alert(
            "Crop Probability",
            `Probability of growing ${selectedCrop} is about ${probabilityPercentage}%. \n\nSpecifically, ${probability}`
          );
          setSelectedCrop("");
        }
      }
      setLoadingPrediction(false);
    } catch (error) {
      console.error("Error predicting:", error);
    }
  };
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

  // console.log(cropData);
  const mapViewRef = useRef(null);

  const handleMarkerAppear = () => {
    if (latitude && longitude && mapViewRef.current) {
      const newRegion = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      mapViewRef.current.animateToRegion(newRegion, 1000);
      // setLoading(false);
    }
  };

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

  useEffect(() => {
    setLoadingMap(false);
  }, [latitude, longitude]);

  useEffect(() => {
    if (weatherData) {
      setLoadingClimateData(false);
    }
  }, [weatherData]);

  useEffect(() => {
    if (!loadingPhosphorus && !loadingPotassium && !loadingNitrogen && !loadingPH) {
      setLoadingSoilData(false);
    }
  }, [loadingPhosphorus, loadingPotassium, loadingNitrogen, loadingPH]);

  const handlePickerChange = (itemValue) => {
    setSelectedCrop(itemValue);
    setSelectedCropClass(itemValue);
    setSelectedCropColor(itemValue ? "red" : "rgba(131, 167, 234, 1)");
    setThreshold(10);

    // setPieChartTitle(
    //   `Crop classes and their distribution - ${itemValue || "All Crops"}`
    // );
    //   setLineChartTitle(
    //     `Visual of Arable land Areas and crops grown - ${
    //       itemValue || "All Crops"
    //     }`
    //   );
    //   setBarTempChartTitle(
    //     `Temperature Data Visualization for ${itemValue || "All Crops"}`
    //   );
    //   setBarHumidChartTitle(
    //     `Humidity Data Visualization for ${itemValue || "All Crops"}`
    //   );
    //   setBarPotassiumChartTitle(
    //     `Potassium Data Visualization for ${itemValue || "All Crops"}`
    //   );
    //   setBarPhosphorousChartTitle(
    //     `Phosphorous Data Visualization for ${itemValue || "All Crops"}`
    //   );
    //   setBarPHChartTitle(`PH Data Visualization for ${itemValue || "All Crops"}`);
    //   setBarNitrogenChartTitle(
    //     `Nitrogen Data Visualization for ${itemValue || "All Crops"}`
    //   );
    //   setBarChartTitle(
    //     `Rainfall Data Visualization for ${itemValue || "All Crops"}`
    //   );
  };

  const line = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2,
      },
    ],
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

  const getPhosphorousData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=phosphorous_extractable&depth=0-20`,
        { withCredentials: true }
      );
      const phosphorousValue =
        res.data.property?.phosphorous_extractable[0].value.value;
      console.log("Phosphorous Value:", phosphorousValue);
      setForm((prevForm) => ({ ...prevForm, P: phosphorousValue }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPhosphorus(false); // Set loading state back to false
    }
  };
  const getPotassiumData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=potassium_extractable&depth=0-20`,
        { withCredentials: true }
      );
      const potassiumValue =
        res.data.property?.potassium_extractable[0].value.value;
      console.log("Potassium Value:", potassiumValue);
      setForm((prevForm) => ({ ...prevForm, K: potassiumValue }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPotassium(false);
    }
  };
  const getNitrogenData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=nitrogen_total&depth=0-20`,
        { withCredentials: true }
      );
      const nitrogenValue = res.data.property?.nitrogen_total[0].value.value;
      console.log("Nitrogen Value:", nitrogenValue);
      setForm((prevForm) => ({ ...prevForm, N: nitrogenValue }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNitrogen(false);
    }
  };
  const getPHData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=ph&depth=0-20`,
        { withCredentials: true }
      );
      const phValue = res.data.property?.ph[0].value.value;
      console.log("Ph Value:", phValue);
      setForm((prevForm) => ({ ...prevForm, pH: phValue }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPH(false);
    }
  };

  const getClimateData = async () => {
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,rain&daily=rain_sum,showers_sum`,
        { withCredentials: true }
      );
      const data = res.data;
      setWeatherData(data);
      if (data && data.hourly && data.hourly.precipitation) {
        const precipitationArray = data.hourly.precipitation;
        const averagePrecipitation =
          precipitationArray.reduce((acc, val) => acc + val, 0) /
          precipitationArray.length;
        setForm((prevForm) => ({
          ...prevForm,
          temperature: data.hourly.temperature_2m[data.hourly.time.length - 2],
          humidity:
            data.hourly.relative_humidity_2m[data.hourly.time.length - 2],
          rainfall: averagePrecipitation * 1000,
        }));
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoadingTemperature(false);
      setLoadingHumidity(false);
      setLoadingRainfall(false);
    }
  };

  if (longitude && latitude) {
    useEffect(() => {
      setLoadingMap(true);
      setLoadingClimateData(true);
      setLoadingSoilData(true);
      setLoadingPrediction(true);
      getClimateData();
      getPhosphorousData();
      getPotassiumData();
      getNitrogenData();
      getPHData();
    }, [longitude, latitude]);
  }

  useEffect(() => {
    if (formFilled) {
      setLoadingPrediction(true);
      handlePredict();
    }
  }, [formFilled]);

  // if (weatherData) {
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     temperature: weatherData.hourly.temperature_2m[0],
  //   }));
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     humidity: weatherData.hourly.relative_humidity_2m[0],
  //   }));
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     rainfall: weatherData.hourly.rain[0],
  //   }));

  //   useEffect(() => {
  //     handlePredict();
  //   }, [form]);
  // }

  let lineChart, barRainfallChart, barHumidityChart;

  if (weatherData) {
    const labelsA = weatherData.hourly.time;
    const temperatureData = weatherData.hourly.temperature_2m.map(Number);
    const humidityDataA = weatherData.hourly.relative_humidity_2m.map(Number);
    const rainfallDataA = weatherData.hourly.rain.map(Number);
    const lineChart = (
      <View>
        <Text style={styles.subTextSmall}>Temperature Line Chart</Text>
        <LineChart
          data={{
            labels: weatherData.hourly.time,
            datasets: [{ data: weatherData.hourly.temperature_2m }],
          }}
          width={460}
          height={320}
          style={chartConfig.style}
          yAxisLabel="°C"
          chartConfig={chartConfig}
        />
      </View>
    );

    barRainfallChart = (
      <View>
        <Text style={styles.subTextSmall}>Rainfall Bar Chart</Text>
        <BarChart
          data={{
            labels: labelsA,
            datasets: [{ data: rainfallDataA }],
          }}
          width={460}
          height={320}
          style={chartConfig.style}
          yAxisLabel="mm"
          chartConfig={chartConfig}
        />
      </View>
    );

    barHumidityChart = (
      <View>
        <Text style={styles.subTextSmall}>Humidity Bar Chart</Text>
        <BarChart
          data={{
            labels: labelsA,
            datasets: [{ data: humidityDataA }],
          }}
          width={460}
          height={320}
          style={chartConfig.style}
          yAxisLabel="%"
          chartConfig={chartConfig}
        />
      </View>
    );
  }
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View>
          {fromHome ? null : (
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
          )}
        </View>
        {fromHome ? (
          <Text style={[styles.subText, { marginTop: "5%" }]}>
            {place} Map view
          </Text>
        ) : (
          <Text style={[styles.subText, { marginTop: "5%" }]}>
            Kenya Map view
          </Text>
        )}
        <Picker
          selectedValue={selectedCrop}
          onValueChange={handlePickerChange}
          style={{ ...styles.picker, color: "black" }}
        >
          <Picker.Item
            style={styles.pickerItem}
            label="Select Crop Class"
            value={null}
          />
          {uniqueCropClasses.map((code) => (
            <Picker.Item
              key={code}
              label={data.find((item) => item.label === code).label}
              value={code}
              style={styles.pickerItem}
            />
          ))}
        </Picker>
        {loadingMap && <ActivityIndicator style={styles.loadingIndicator} />}
        <MapView
          ref={mapViewRef}
          style={styles.map}
          initialRegion={{
            latitude: latitude || 1.2921,
            longitude: longitude || 36.8219,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
          onMapReady={() => setLoadingMap(false)}
        >
          {polygons.map((feature, index) => (
            <Polygon
              key={index}
              coordinates={
                feature && feature.geometry
                  ? feature.geometry.coordinates[0]
                  : []
              }
              fillColor="rgba(0, 128, 255, 0.5)"
              strokeColor="rgba(0, 128, 255, 1)"
            />
          ))}

          {latitude && longitude && (
            <Marker
              coordinate={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              }}
              pinColor="red"
              title={place}
              onCalloutPress={handleMarkerAppear}
            />
          )}
        </MapView>
        <Text style={styles.subText}>Land Characteristics</Text>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>Phosphorous Levels:</Text>
            {loadingPhosphorus ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>{form.K}</Text>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>Nitrogen Levels:</Text>
            {loadingNitrogen ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>{form.N}</Text>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>Potassium Levels:</Text>
            {loadingPotassium ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>{form.P}</Text>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>Humidity Level:</Text>
            {loadingHumidity ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>{form.humidity}</Text>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>pH Level:</Text>
            {loadingPH ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>{form.pH}</Text>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>Quantity of Rainfall:</Text>
            {loadingRainfall ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>{form.rainfall.toFixed(2)}</Text>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>Temperature:</Text>
            {loadingTemperature ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>{form.temperature}</Text>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <Text style={styles.label}>Prediction:</Text>
            {prediction.predicted_class ? (
              // <>
              <Text>The best crop to grow is {prediction.predicted_class}</Text>
            ) : (
              // </>
              <ActivityIndicator size="small" color="#0000ff" />
            )}
          </View>
        </View>
        {/* <View style={styles.sliderContainer}>
          <Text style={styles.label}>Probability of Growing:</Text>
          <Slider
            style={{ width: "80%", height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={prediction.probability || 0}
            minimumTrackTintColor="#FF5733"
            maximumTrackTintColor="#000000"
            thumbTintColor="#FF5733"
            disabled={!prediction.probability}
          />
        </View> */}

        {/* {prediction.probability === 0 &&
          Alert.alert("This crop might not do well in this area")} */}

        {/* {longitude && latitude && weatherData ? (
          <View>
            {lineChart}
            {barRainfallChart}
            {barHumidityChart}
          </View>
        ) : null}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barTempChartTitle}</Text>
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
          </>
        )}

        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barChartTitle}</Text>
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
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barHumidChartTitle}</Text>
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
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barPotassiumChartTitle}</Text>
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
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barPHChartTitle}</Text>

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
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barNitrogenChartTitle}</Text>
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
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barPhosphorousChartTitle}</Text>
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
          </>
        )} */}

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "fb8c00",
  backgroundGradientFrom: "green",
  backgroundGradientTo: "#71f075",
  decimalPlaces: 2,
  style: {
    borderRadius: 15,
    marginLeft: "2%",
  },
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    marginLeft: "5%",
    marginTop: "14%",
    fontSize: 22,
    marginBottom: "8%",
    color: "#ccc",
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
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
    marginRight: 5,
  },
  card: {
    backgroundColor: "green",
    color: "white",
    borderRadius: 10,
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: "white",
  },
  label: {
    fontWeight: "bold",
    color: "white",
  },
});
