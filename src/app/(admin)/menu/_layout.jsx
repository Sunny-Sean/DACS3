import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

import Colors from "../../../constants/Colors";

import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";

export default function MenuStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href="/(admin)/menu/create" asChild>
              <Pressable>
                {({ pressed }) => (
                  <AntDesign
                    name="pluscircle"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
