import { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import type { IconName } from "@/data/dummy";

// Catatan dan Pengingat ditambahkan di 2F-2
const links: { icon: IconName; label: string; route: string }[] = [
  { icon: "calendar", label: "Agenda", route: "/agenda" },
  { icon: "check-square", label: "To-Do", route: "/todos" },
];

function Tile({ icon, label, route }: (typeof links)[number]) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={() => router.push(route as any)}
        onPressIn={() => to(0.95)}
        onPressOut={() => to(1)}
        accessibilityRole="button"
        style={styles.tile}
      >
        <View style={styles.icon}>
          <Feather name={icon} size={22} color={colors.primary} />
        </View>
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 14 }}>
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

export function QuickLinks() {
  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 }}>
        Akses Cepat
      </AppText>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {links.map((l) => (
          <Tile key={l.route} {...l} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
