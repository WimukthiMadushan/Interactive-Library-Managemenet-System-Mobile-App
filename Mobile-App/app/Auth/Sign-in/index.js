import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const OnSignIn = async () => {
    try {
      // Ensure all fields are filled out
      if (!username || !password) {
        Alert.alert("Error", "All fields are required");
        return;
      }

      const response = await axios.post(
        "http://192.168.188.169:5001/api/auth/login",
        {
          Username: username,
          Password: password,
        }
      ); 
      
      const { token,userId } = response.data;
      if (token) {
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userId", userId.toString());
        console.log("Signing in...");
        console.log(router);
        router.replace("/(tabs)");
        console.log(router);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to sign in. Please check your credentials.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.goBackButton}
        >
          <Ionicons name="arrow-back-circle" size={25} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Sign In</Text>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={(value) => setUsername(value)}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        <TouchableOpacity onPress={OnSignIn} style={styles.signInButton}>
          <Text style={styles.signInText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/Auth/Sign-up")}
          style={styles.createAccountButton}
        >
          <Text style={styles.createAccountText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{ textAlign: "center" }}>All Right Reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    marginTop: 10,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    paddingTop: 40,
  },
  goBackButton: {
    marginBottom: 5,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  signInButton: {
    marginTop: 20,
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  signInText: {
    color: "white",
    fontFamily: "outfit-bold",
    fontSize: 17,
  },
  createAccountButton: {
    marginTop: 20,
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
    borderColor: "#ccc",
    alignItems: "center",
  },
  createAccountText: {
    fontFamily: "outfit-regular",
    fontSize: 17,
  },
});
