import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { AppText } from "./AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";

type Option<T extends string> = { key: T; label: string; dot?: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (key: T) => void;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const [width, setWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const index = options.findIndex((o) => o.key === value);
  const segW = width > 0 ? (width - 8) / options.length : 0;

  useEffect(() => {
    if (!segW) return;
    Animated.timing(x, {
      toValue: index * segW,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [index, segW, x]);

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.track} onLayout={onLayout}>
      {segW > 0 && (
        <Animated.View
          style={[
            styles.thumb,
            { width: segW, transform: [{ translateX: x }] },
          ]}
        />
      )}
      {options.map((o) => {
        const selected = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={styles.item}
          >
            {o.dot ? (
              <View style={[styles.dot, { backgroundColor: o.dot }]} />
            ) : null}
            <AppText
              style={{
                fontFamily: selected ? fonts.semibold : fonts.medium,
                fontSize: 14,
                color: selected ? colors.primary : colors.text,
              }}
            >
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: 4,
    height: 52,
    backgroundColor: colors.primaryField,
    borderRadius: radius.lg,
  },
  thumb: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow.card,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
