import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to InfoPulsse Library.</Text>
      <Text style={styles.subtitle}>Empowering Your Reading Journey!!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./Auth/Sign-up")}
      >
        <Text style={styles.buttonText}>Let's Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-bold",
    color: "#343a40",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#495057",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    padding: 15,
    backgroundColor: "#000000",
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
  infoButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
  },
});
