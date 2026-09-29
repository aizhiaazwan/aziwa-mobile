import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors, fonts, radius } from "@/constants/theme";

type Props = { message: string | null; onHide: () => void };

export function Toast({ message, onHide }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(1600),
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onHide();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.pill}>
        <Feather name="check-circle" size={18} color={colors.accent} />
        <AppText
          style={{ fontFamily: fonts.medium, fontSize: 14, color: "#fff" }}
        >
          {message}
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // right: 96 supaya tidak menutupi tombol +
  wrap: {
    position: "absolute",
    left: 20,
    right: 96,
    bottom: 28,
    pointerEvents: "none",
  },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
});
