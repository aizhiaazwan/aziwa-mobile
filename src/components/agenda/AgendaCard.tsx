import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { Agenda, categoryMeta } from "@/contexts/AgendaContext";

type Props = {
  item: Agenda;
  removing?: boolean;
  onPress: (id: number) => void;
  onMore: (id: number) => void;
  onRemoved: (id: number) => void;
};

export function AgendaCard({
  item,
  removing,
  onPress,
  onMore,
  onRemoved,
}: Props) {
  const meta = categoryMeta[item.category];
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!removing) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -40,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onRemoved(item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removing]);

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateX }] }]}
    >
      <Pressable
        onPress={() => onPress(item.id)}
        accessibilityRole="button"
        style={({ pressed }) => [styles.inner, pressed && { opacity: 0.85 }]}
      >
        <View style={styles.time}>
          <AppText style={{ fontFamily: fonts.bold, fontSize: 15 }}>
            {item.startTime}
          </AppText>
          <AppText variant="caption">{item.endTime}</AppText>
        </View>
        <View style={[styles.bar, { backgroundColor: meta.fg }]} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={[styles.pill, { backgroundColor: meta.bg }]}>
            <Feather name={meta.icon} size={12} color={meta.fg} />
            <AppText
              style={{
                fontFamily: fonts.semibold,
                fontSize: 12,
                lineHeight: 16,
                color: meta.fg,
              }}
            >
              {meta.label}
            </AppText>
          </View>
          <AppText
            style={{ fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 }}
          >
            {item.title}
          </AppText>
          {item.description ? (
            <AppText variant="caption" numberOfLines={1}>
              {item.description}
            </AppText>
          ) : null}
        </View>
        {item.reminder && <Feather name="bell" size={16} color="#8A5A00" />}
        <Pressable
          onPress={() => onMore(item.id)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Menu agenda"
          style={{ padding: 4 }}
        >
          <Feather name="more-vertical" size={20} color={colors.text} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  inner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  time: { width: 46, alignItems: "center" },
  bar: { width: 4, alignSelf: "stretch", borderRadius: 2 },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
});
