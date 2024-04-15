import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

import Colors from "../../../constants/Colors";

import { FontAwesome, AntDesign } from "@expo/vector-icons";

export default function MenuStack() {
  return (
    <Stack>
      {/* <Stack.Screen name="index" options={{ title: "Orders" }} /> */}
      <Stack.Screen name="list" options={{ headerShown: false }} />
    </Stack>
  );
}
