import type { ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { IconName } from "@/data/dummy";

// color bertipe ColorValue (sesuai React Navigation), lalu dipakai sebagai string untuk ikon
function tabIcon(name: IconName) {
  return ({
    color,
    size,
  }: {
    focused: boolean;
    color: ColorValue;
    size: number;
  }) => <Feather name={name} size={size} color={color as string} />;
}

export default function TabsLayout() {
  const { isDesktop } = useBreakpoint();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 12 },
        tabBarStyle: isDesktop
          ? { display: "none" }
          : {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              height: 66,
              paddingTop: 6,
              paddingBottom: 8,
            },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: tabIcon("grid") }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: "Tugas", tabBarIcon: tabIcon("check-circle") }}
      />
      <Tabs.Screen
        name="courses"
        options={{ title: "Matkul", tabBarIcon: tabIcon("book-open") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profil", tabBarIcon: tabIcon("user") }}
      />
    </Tabs>
  );
}
