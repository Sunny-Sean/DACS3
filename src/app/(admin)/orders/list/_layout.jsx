import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Tabs, withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const TobTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
  return (
    <SafeAreaView
      edges={["tops"]}
      style={{ flex: 1, backgroundColor: "white", paddingTop: 30 }}
    >
      <TobTabs>
        <TobTabs.Screen name="index" options={{ title: "Active" }} />
      </TobTabs>
    </SafeAreaView>
  );
}
