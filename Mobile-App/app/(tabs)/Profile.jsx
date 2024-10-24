import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [authState, setAuthState] = useState({
    userId: null,
    username: null,
    role: null,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          const decoded = jwtDecode(token);
          setAuthState({
            userId: decoded.ID,
            username: decoded.Username,
            role: decoded.Role,
          });

          // Fetch additional user details
          const response = await axios.get(
            `http://192.168.188.169:5001/api/user/${decoded.ID}`
          );
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        {/* User Image and Welcome Message */}
        <Image
          source={require("../../assets/images/dp.jpg")}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeMessage}>
          Welcome, {authState.username}!
        </Text>
        {authState.role && (
          <Text style={styles.roleMessage}>
            {authState.role === "Administrator" ||
            authState.role === "Receptionist"
              ? `Role: ${authState.role}`
              : ""}
          </Text>
        )}
      </View>

      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.profileName}>
          {userDetails.First_Name} {userDetails.Last_Name}
        </Text>
        <Text style={styles.profileUsername}>@{userDetails.Username}</Text>
        <Text style={styles.profileAddress}>{authState.userId}</Text>
        <Text style={styles.profileEmail}>{userDetails.Email}</Text>
        <Text style={styles.profileAddress}>{userDetails.Address}</Text>
        <Text style={styles.profileRegistered}>
          Joined on:{" "}
          {new Date(userDetails.Registered_Date).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginTop: 60,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  roleMessage: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  profileUsername: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    marginBottom: 10,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  profileAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  profileRegistered: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
});

export default Profile;
