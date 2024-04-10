import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Home,
  Analytics,
  Predictions,
  ProfileScreen,
  EditProfileScreen,
  MyAccountScreen,
  AboutPage,
  HelpAndSupportPage,
  TwoFactorAuthPage,
  BiometricAuthPage,
  EmergencyContactsPage,
  LandingPage,
  AdminHome,
  LeaseLandPage,
  LandForLease,
  AdminLandReport,
  AdminAllUsers,
} from "./components";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import LogIn from "./components/Landing/LogIn";
import SignUp from "./components/Landing/SignUp";
import { AuthProvider, useAuth } from "./AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AdminLandListings from "./components/Admin/AdminLandListings";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WelcomeUserHome"
        component={Home}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" color={"green"} size={size} />
          ),
        }}
      />
      <Stack.Screen
        name="Analytics"
        component={Analytics}
        options={{ title: "Analytics" }}
      />
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ title: "Admin Home" }}
      />
      <Stack.Screen
        name="LeaseLand"
        component={LeaseLandPage}
        options={{ title: "Lease Land" }}
      />
      <Stack.Screen
        name="LandForLease"
        component={LandForLease}
        options={{ title: "Available Land for Leasing" }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile Page"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="Account Screen"
        component={MyAccountScreen}
        options={{ title: "My Account" }}
      />
      <Stack.Screen
        name="About Screen"
        component={AboutPage}
        options={{ title: "About Us" }}
      />
      <Stack.Screen
        name="Help Screen"
        component={HelpAndSupportPage}
        options={{ title: "Help and Support" }}
      />
      <Stack.Screen
        name="Two Factor Authentication"
        component={TwoFactorAuthPage}
        options={{ title: "Two Factor Authentication" }}
      />
      <Stack.Screen
        name="Biometric Authentication"
        component={BiometricAuthPage}
        options={{ title: "Biometric Authentication" }}
      />
      <Stack.Screen
        name="Emergency Contacts"
        component={EmergencyContactsPage}
        options={{ title: "Notifications" }}
      />
    </Stack.Navigator>
  );
};

const LandingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Landing"
        component={LandingPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LogIn"
        component={LogIn}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignInStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const SignInStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LogIn"
        component={LogIn}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <AuthProvider>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaView>
  );
};

const MainApp = () => {
  const { role, user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "green",
        },
        headerTintColor: "white",
      }}
    >
      {role ? (
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Landing"
          component={LandingStack}
          options={{ headerShown: false }}
        />
      )}
      
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const route = useRoute();
  const { role } = useAuth();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="WelcomeUserHomeTab"
        component={HomeStack}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" color={"green"} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={Analytics}
        options={{
          title: "Analytics",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={"green"} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PredictTab"
        component={Predictions}
        options={{
          title: "Prediction",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" color={"green"} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={"green"} size={size} />
          ),
        }}
      />
      {role && role === "admin" ? (
        <Tab.Screen
          name="AdminStack"
          component={AdminStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="shield-checkmark-outline"
                color={"green"}
                size={size}
              />
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
};

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHomeLandListing"
        component={AdminLandListings}
        options={{ title: "Admin Land Listing" }}
      />
      <Stack.Screen
        name="AdminLandReport"
        component={AdminLandReport}
        options={{ title: "Admin Land Report" }}
      />
      <Stack.Screen
        name="AdminAllUsers"
        component={AdminAllUsers}
        options={{title: "All Users"}}
      />
    </Stack.Navigator>
  );
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
});

export default App;
