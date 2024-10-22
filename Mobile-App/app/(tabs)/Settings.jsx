import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons

const Settings = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logout", "You have been logged out successfully.");
      router.push("./../Auth/Sign-in");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  // A simple static list of settings (without functionality)
  const settingsOptions = [
    { title: "Account", icon: "person-outline" },
    { title: "Notifications", icon: "notifications-outline" },
    { title: "Privacy & Security", icon: "lock-closed-outline" },
    { title: "Language", icon: "language-outline" },
    { title: "Help", icon: "help-circle-outline" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {/* Display settings options */}
      {settingsOptions.map((option, index) => (
        <TouchableOpacity key={index} style={styles.option}>
          <Ionicons name={option.icon} size={24} color="#333" />
          <Text style={styles.optionText}>{option.title}</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#999" />
        </TouchableOpacity>
      ))}

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
    marginTop: 50,
    textAlign: "left",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "left",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  logoutContainer: {
    marginTop: 40,
    alignItems: "center",
    padding: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Settings;
