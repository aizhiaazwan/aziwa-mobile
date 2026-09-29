import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { Badge } from "@/components/ui/Badge";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import {
  priorityLabel,
  priorityTone,
  statusLabel,
  statusTone,
} from "@/constants/labels";
import { formatDate } from "@/utils/date";
import type { Course, Task } from "@/data/dummy";

type Props = {
  task: Task;
  course: Course;
  urgent: boolean;
  removing?: boolean;
  onToggle: (id: number) => void;
  onMore: (id: number) => void;
  onRemoved: (id: number) => void;
};

export function TaskListCard({
  task,
  course,
  urgent,
  removing,
  onToggle,
  onMore,
  onRemoved,
}: Props) {
  const done = task.status === "completed";
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const bar = useRef(new Animated.Value(0)).current;

  const sub = task.subtasks;
  const pct = sub ? Math.round((sub.done / sub.total) * 100) : 0;

  // Progress bar mengisi perlahan
  useEffect(() => {
    Animated.timing(bar, {
      toValue: pct,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, bar]);

  // Geser keluar saat dihapus
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
    ]).start(() => onRemoved(task.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removing]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(pop, {
        toValue: 1.25,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(pop, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 8,
      }),
    ]).start();
    onToggle(task.id);
  };

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateX }] }]}
    >
      <Animated.View style={{ transform: [{ scale: pop }] }}>
        <Pressable
          onPress={handleToggle}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={`Tandai ${task.title}`}
          style={[styles.checkbox, done && { backgroundColor: colors.primary }]}
        >
          {done && <Feather name="check" size={18} color="#fff" />}
        </Pressable>
      </Animated.View>

      <View style={{ flex: 1, gap: 10 }}>
        <View style={styles.tags}>
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.coursePill,
                done && { backgroundColor: "#ECEAF5" },
              ]}
            >
              <AppText
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  lineHeight: 16,
                  color: done ? colors.textMuted : colors.primary,
                }}
              >
                {course.name}
              </AppText>
            </View>
          </View>
          {!done && (
            <Badge
              label={priorityLabel[task.priority]}
              tone={priorityTone[task.priority]}
            />
          )}
          <Badge
            label={statusLabel[task.status]}
            tone={statusTone[task.status]}
          />
        </View>

        <AppText
          style={{
            fontFamily: fonts.bold,
            fontSize: 18,
            lineHeight: 26,
            color: done ? colors.textMuted : colors.text,
            textDecorationLine: done ? "line-through" : "none",
          }}
        >
          {task.title}
        </AppText>

        {sub && !done && (
          <View style={styles.subBox}>
            <View style={styles.subHead}>
              <Feather name="check-square" size={16} color={colors.primary} />
              <AppText
                style={{
                  flex: 1,
                  fontFamily: fonts.medium,
                  fontSize: 13,
                  color: colors.textMuted,
                }}
              >
                Subtasks Progress
              </AppText>
              <AppText
                style={{
                  fontFamily: fonts.semibold,
                  fontSize: 13,
                  color: colors.primary,
                }}
              >
                {sub.done}/{sub.total} ({pct}%)
              </AppText>
            </View>
            <View style={styles.track}>
              <Animated.View
                style={[
                  styles.fill,
                  {
                    width: bar.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Feather
              name={done ? "check" : "calendar"}
              size={18}
              color={
                done ? colors.textMuted : urgent ? colors.danger : colors.text
              }
            />
            <AppText
              style={{
                fontSize: 14,
                color: done
                  ? colors.textMuted
                  : urgent
                    ? colors.danger
                    : colors.text,
              }}
              numberOfLines={1}
            >
              {done && task.completedAt
                ? `Selesai ${formatDate(task.completedAt)}`
                : formatDate(task.deadline)}
            </AppText>
          </View>

          {task.reminder && !done && (
            <View style={styles.reminder}>
              <Feather name="bell" size={14} color="#8A5A00" />
              <AppText
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: "#8A5A00",
                }}
              >
                {task.reminder}
              </AppText>
            </View>
          )}

          <Pressable
            onPress={() => onMore(task.id)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Menu tugas"
            style={styles.more}
          >
            <Feather name="more-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    ...shadow.card,
  },
  checkbox: {
    marginTop: 4,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tags: { flexDirection: "row", alignItems: "center", gap: 8 },
  coursePill: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: "#E6E0FF",
  },
  subBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 12,
    gap: 8,
  },
  subHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DCD5FF",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3, backgroundColor: colors.primary },
  footer: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  reminder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  more: { padding: 4 },
});
