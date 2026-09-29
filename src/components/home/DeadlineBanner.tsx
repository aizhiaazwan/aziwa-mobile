import { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";

type Props = {
  label: string;
  time: string;
  title: string;
  note: string;
  onPress?: () => void;
};

export function DeadlineBanner({ label, time, title, note, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => to(0.98)}
        onPressOut={() => to(1)}
        accessibilityRole="button"
        style={styles.card}
      >
        <View style={styles.iconBox}>
          <Feather name="bell" size={26} color="#fff" />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText style={styles.label}>
            {label} • {time}
          </AppText>
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.note}>{note}</AppText>
        </View>
        <Feather name="chevron-right" size={22} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: 16,
    ...shadow.primary,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 26,
    color: "#fff",
  },
  note: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.85)",
  },
});
