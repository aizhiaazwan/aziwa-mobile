import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { Reminder, offsetMeta } from "@/contexts/RemindersContext";
import { Target } from "@/utils/reminder";
import { formatDeadline } from "@/utils/date";

type Props = {
  reminder: Reminder;
  target: Target | null;
  trigger: string | null; // ISO waktu berbunyi
  past: boolean;
  removing?: boolean;
  onToggle: (id: number) => void;
  onPress: (id: number) => void;
  onMore: (id: number) => void;
  onRemoved: (id: number) => void;
};

export function ReminderCard({
  reminder,
  target,
  trigger,
  past,
  removing,
  onToggle,
  onPress,
  onMore,
  onRemoved,
}: Props) {
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
    ]).start(() => onRemoved(reminder.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removing]);

  const isTask = reminder.kind === "task";
  const off = !reminder.enabled;

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateX }] }]}
    >
      <View style={styles.row}>
        <Pressable
          onPress={() => onPress(reminder.id)}
          accessibilityRole="button"
          style={[styles.main, off && { opacity: 0.55 }]}
        >
          <View
            style={[
              styles.icon,
              {
                backgroundColor: isTask
                  ? colors.primarySoft
                  : colors.accentSoft,
              },
            ]}
          >
            <Feather
              name={isTask ? "check-circle" : "calendar"}
              size={22}
              color={isTask ? colors.primary : "#8A5A00"}
            />
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <AppText
              style={{ fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 }}
              numberOfLines={2}
            >
              {target ? target.title : "Target sudah dihapus"}
            </AppText>
            <View style={styles.badges}>
              <Badge
                label={isTask ? "Tugas" : "Agenda"}
                tone={isTask ? "primary" : "warning"}
              />
              <Badge label={offsetMeta[reminder.offset].label} tone="neutral" />
            </View>
          </View>
        </Pressable>

        <View style={styles.side}>
          <Toggle
            value={reminder.enabled}
            onChange={() => onToggle(reminder.id)}
          />
          <Pressable
            onPress={() => onMore(reminder.id)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Menu pengingat"
            style={{ padding: 4 }}
          >
            <Feather name="more-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.footer, off && { opacity: 0.55 }]}>
        <Feather
          name="bell"
          size={15}
          color={!target ? colors.danger : past ? colors.textMuted : "#8A5A00"}
        />
        <AppText
          style={{
            flex: 1,
            fontSize: 13,
            color: !target ? colors.danger : colors.textMuted,
          }}
          numberOfLines={1}
        >
          {!target
            ? "Hapus pengingat ini atau pilih target baru."
            : past
              ? `Sudah lewat • ${formatDeadline(trigger!)}`
              : `Berbunyi ${formatDeadline(trigger!)}`}
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  side: { alignItems: "center", gap: 8 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
