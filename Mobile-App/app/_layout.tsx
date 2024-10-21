import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text, View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "outfit-black": require("./../assets/fonts/Outfit-Black.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
    "outfit-extra-bold": require("./../assets/fonts/Outfit-ExtraBold.ttf"),
    "outfit-extra-light": require("./../assets/fonts/Outfit-ExtraLight.ttf"),
    "outfit-light": require("./../assets/fonts/Outfit-Light.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-regular": require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-semibold": require("./../assets/fonts/Outfit-SemiBold.ttf"),
    "outfit-thin": require("./../assets/fonts/Outfit-Thin.ttf"),
  });

  if (!fontsLoaded) {
    // Show a loading indicator until fonts are loaded
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
