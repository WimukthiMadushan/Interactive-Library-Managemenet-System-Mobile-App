import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  useFonts({
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
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
