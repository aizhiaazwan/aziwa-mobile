import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ColorValue } from "react-native";
import { colors, fonts } from "@/constants/theme";

type IconName = React.ComponentProps<typeof Feather>["name"];

function tabIcon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Feather name={name} size={size} color={color} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 66,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: tabIcon("grid"),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tugas",
          tabBarIcon: tabIcon("check-circle"),
        }}
      />

      <Tabs.Screen
        name="courses"
        options={{
          title: "Matkul",
          tabBarIcon: tabIcon("book-open"),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: tabIcon("user"),
        }}
      />
    </Tabs>
  );
}
