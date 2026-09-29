import { useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { Badge, Tone } from "@/components/ui/Badge";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { priorityLabel, statusLabel } from "@/constants/labels";
import { formatDeadline } from "@/utils/date";
import type { Course, Priority, Status, Task } from "@/data/dummy";

const priorityTone: Record<Priority, Tone> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};
const statusTone: Record<Status, Tone> = {
  pending: "warning",
  in_progress: "primary",
  completed: "success",
};

type Props = {
  task: Task;
  course: Course;
  urgent?: boolean;
  onComplete: (id: number) => void;
  onPress?: (id: number) => void;
};

export function TaskRowCard({
  task,
  course,
  urgent,
  onComplete,
  onPress,
}: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const toScale = (v: number) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  // Kartu geser keluar dan memudar, baru status diubah
  const handleComplete = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 40,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onComplete(task.id));
  };

  const tint =
    course.tone === "accent" ? colors.accentSoft : colors.primarySoft;
  const tintFg = course.tone === "accent" ? "#8A5A00" : colors.primary;

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }, { scale }] }}>
      <Pressable
        onPress={() => onPress?.(task.id)}
        onPressIn={() => toScale(0.98)}
        onPressOut={() => toScale(1)}
        style={styles.card}
      >
        <View style={styles.top}>
          <View style={[styles.iconBox, { backgroundColor: tint }]}>
            <Feather name={course.icon} size={22} color={tintFg} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.course} numberOfLines={1}>
              {course.name.toUpperCase()}
            </AppText>
            <AppText style={styles.title} numberOfLines={1}>
              {task.title}
            </AppText>
          </View>
          <Badge
            label={priorityLabel[task.priority]}
            tone={priorityTone[task.priority]}
          />
        </View>

        <View style={styles.bottom}>
          <View style={styles.dateRow}>
            <Feather
              name={urgent ? "clock" : "calendar"}
              size={18}
              color={urgent ? colors.danger : colors.primary}
            />
            <AppText
              style={{ fontSize: 14, color: colors.textMuted }}
              numberOfLines={1}
            >
              {formatDeadline(task.deadline)}
            </AppText>
          </View>
          <Badge
            label={statusLabel[task.status]}
            tone={statusTone[task.status]}
          />
          <Pressable
            onPress={handleComplete}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Tandai selesai"
            style={styles.check}
          >
            <Feather name="check" size={20} color={colors.text} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    gap: 16,
    ...shadow.card,
  },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  course: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textMuted,
  },
  title: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 24 },
  bottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  check: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
