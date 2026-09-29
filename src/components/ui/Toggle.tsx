import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

type Props = { value: boolean; onChange: (v: boolean) => void };

export function Toggle({ value, onChange }: Props) {
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(x, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, x]);

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: x.interpolate({
              inputRange: [0, 1],
              outputRange: ["#D9D5EC", colors.primary],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [
                {
                  translateX: x.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 22],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 54,
    height: 32,
    borderRadius: 16,
    padding: 4,
    justifyContent: "center",
  },
  thumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#fff" },
});

