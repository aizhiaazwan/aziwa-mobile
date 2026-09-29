import { ReactNode, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
};

export function Chip({ label, selected, onPress, icon }: Props) {
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
        onPressIn={() => to(0.94)}
        onPressOut={() => to(1)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={[styles.chip, selected ? styles.on : styles.off]}
      >
        {icon}
        <AppText
          style={{
            fontFamily: fonts.medium,
            fontSize: 14,
            color: selected ? colors.textOnPrimary : colors.text,
          }}
        >
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    height: 40,
    borderRadius: radius.pill,
  },
  on: {
    backgroundColor: colors.primary,
    ...shadow.primary,
    shadowOpacity: 0.18,
    elevation: 3,
  },
  off: { backgroundColor: colors.surface, ...shadow.card },
});
