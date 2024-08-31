import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  // State variables for each input field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const OnCreateAccount = () => {
    // Handle account creation logic here
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

        <Text style={styles.title}>Register.</Text>

        {/* First Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter First Name"
            value={firstName}
            onChangeText={(value) => setFirstName(value)}
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Last Name"
            value={lastName}
            onChangeText={(value) => setLastName(value)}
          />
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Username"
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

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={address}
            onChangeText={(value) => setAddress(value)}
          />
        </View>

        {/* Mobile Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChangeText={(value) => setMobileNumber(value)}
          />
        </View>

        {/* ID Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ID Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ID Number"
            value={idNumber}
            onChangeText={(value) => setIdNumber(value)}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("Auth/Sign-in")}
          style={styles.signInButton}
        >
          <Text style={styles.signInText}>If You Already Library Member.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={OnCreateAccount}
          style={styles.createAccountButton}
        >
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    marginTop: 5,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    paddingTop: 30,
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
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
    borderColor: "#ccc",
    alignItems: "center",
  },
  signInText: {
    fontFamily: "outfit-regular",
    fontSize: 17,
  },
  createAccountButton: {
    marginTop: 20,
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  createAccountText: {
    color: "white",
    fontFamily: "outfit-bold",
    fontSize: 17,
  },
});