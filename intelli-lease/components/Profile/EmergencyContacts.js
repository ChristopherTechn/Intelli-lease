import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const EmergencyContactsPage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    UserEmail: "",
    UserID: "",
    Token: "",
  });
  const [notifications, setNotifications] = useState([]);

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
          UserID: userId || "",
          Token: token || "",
        });
      } catch (error) {
        console.error(
          "Error retrieving user data from AsyncStorage:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleNotifications = async () => {
    try {
      const response = await fetch(
        "https://intelli-lease-v1-1.onrender.com/view-notifications",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": userData.Token,
          },
          body: JSON.stringify({ UserID: userData.UserID }),
        }
      );

      if (!response.ok) {
        console.error("Error viewing notifications:", response.status);
        return;
      }

      const results = await response.json();
      setNotifications(results.results);
    } catch (error) {
      console.error("Error viewing notifications:", error.message);
    }
  };

  useEffect(() => {
    handleNotifications();
  }, [userData]);

  const markAsRead = (notificationID) => {
    // Implement your logic to mark notification as read
  };

  const markAsUnread = (notificationID) => {
    // Implement your logic to mark notification as unread
  };

  return (
    <ScrollView style={styles.container}>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <TouchableOpacity
            key={notification.NotificationsID}
            onPress={() => {
              console.log(
                "Notification pressed:",
                notification.NotificationsID
              );
            }}
            style={[
              styles.notification,
              { backgroundColor: notification.isRead ? "#f0f0f0" : "#ffffff" },
            ]}
          >
            <Text style={styles.notificationText}>
              {notification.NotificationContent}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => markAsRead(notification.NotificationsID)}
                style={[styles.actionButton, styles.readButton]}
              >
                <Text>Mark as Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => markAsUnread(notification.NotificationsID)}
                style={[styles.actionButton, styles.unreadButton]}
              >
                <Text>Mark as Unread</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noNotificationText}>
          No notifications to display
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  notification: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 30,
    borderRadius: 8,
    backgroundColor: "blue",
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 40,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
  },
  readButton: {
    backgroundColor: "#4caf50"
  },
  unreadButton: {
    backgroundColor: "#f44336",
  },
  noNotificationText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
  },
});

export default EmergencyContactsPage;
