import { ReactNode, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";
import { AppText } from "./AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "soft";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  iconLeft,
  iconRight,
  loading,
  disabled,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const isPrimary = variant === "primary";

  const to = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Animated.View
      style={{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => to(0.97)}
        onPressOut={() => to(1)}
        disabled={disabled || loading}
        accessibilityRole="button"
        style={[
          styles.base,
          isPrimary ? styles.primary : styles.soft,
          isPrimary && shadow.primary,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={isPrimary ? colors.textOnPrimary : colors.primary}
          />
        ) : (
          <>
            {iconLeft}
            <AppText
              style={{
                fontFamily: fonts.semibold,
                fontSize: 16,
                color: isPrimary ? colors.textOnPrimary : colors.text,
              }}
            >
              {label}
            </AppText>
            {iconRight}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primary: { backgroundColor: colors.primary },
  soft: { backgroundColor: colors.primaryField },
});
