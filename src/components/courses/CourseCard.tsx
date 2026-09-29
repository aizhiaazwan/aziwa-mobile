import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { Badge } from "@/components/ui/Badge";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { DAY_NAMES } from "@/utils/date";
import type { Course } from "@/data/dummy";

export type CourseStats = { active: number; urgent: number; done: number };

type Props = {
  course: Course;
  stats: CourseStats;
  removing?: boolean;
  onOpenTasks: (id: number) => void;
  onMore: (id: number) => void;
  onRemoved: (id: number) => void;
};

export function CourseCard({
  course,
  stats,
  removing,
  onOpenTasks,
  onMore,
  onRemoved,
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
    ]).start(() => onRemoved(course.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removing]);

  const accent = course.tone === "accent";
  const tint = accent ? colors.accentSoft : colors.primarySoft;
  const fg = accent ? "#8A5A00" : colors.primary;

  const time = `${course.startTime.replace(":", ".")} - ${course.endTime.replace(":", ".")} WIB`;
  const schedule = `${DAY_NAMES[course.day]}, ${time}${course.room ? ` • ${course.room}` : ""}`;

  return (
    <Animated.View
      style={[styles.wrap, { opacity, transform: [{ translateX }, { scale }] }]}
    >
      <Pressable
        onPress={() => onOpenTasks(course.id)}
        onPressIn={() => toScale(0.985)}
        onPressOut={() => toScale(1)}
        accessibilityRole="button"
        style={styles.card}
      >
        <View style={[styles.stripe, { backgroundColor: course.stripe }]} />
        <View style={styles.body}>
          <View style={styles.top}>
            <View style={[styles.iconBox, { backgroundColor: tint }]}>
              <Feather name={course.icon} size={24} color={fg} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText
                style={{ fontFamily: fonts.medium, fontSize: 13, color: fg }}
              >
                {course.code}{" "}
                <AppText style={{ color: colors.textMuted }}>
                  • {course.sks} SKS
                </AppText>
              </AppText>
              <AppText
                style={{ fontFamily: fonts.bold, fontSize: 19, lineHeight: 26 }}
              >
                {course.name}
              </AppText>
            </View>
            <Pressable
              onPress={() => onMore(course.id)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Menu mata kuliah"
              style={{ padding: 4 }}
            >
              <Feather name="more-vertical" size={20} color={colors.text} />
            </Pressable>
          </View>

          <View style={{ gap: 6 }}>
            {course.lecturer ? (
              <View style={styles.infoRow}>
                <Feather name="user" size={16} color={fg} />
                <AppText style={styles.info}>{course.lecturer}</AppText>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Feather name="clock" size={16} color={fg} />
              <AppText style={styles.info}>{schedule}</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.footer}>
            <View style={styles.badges}>
              {stats.active > 0 && (
                <Badge
                  label={`${stats.active} Tugas Aktif`}
                  tone={accent ? "warning" : "primary"}
                />
              )}
              {stats.urgent > 0 && (
                <Badge label={`${stats.urgent} Deadline Dekat`} tone="danger" />
              )}
              {stats.active === 0 && stats.done > 0 && (
                <Badge label={`✓ ${stats.done} Tugas Selesai`} tone="success" />
              )}
              {stats.active === 0 && stats.done === 0 && (
                <Badge label="Belum ada tugas" tone="neutral" />
              )}
            </View>
            <View style={styles.link}>
              <AppText
                style={{
                  fontFamily: fonts.semibold,
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                Lihat Tugas
              </AppText>
              <Feather name="chevron-right" size={16} color={colors.primary} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  card: { flexDirection: "row", borderRadius: radius.xl, overflow: "hidden" },
  stripe: { width: 6 },
  body: { flex: 1, padding: 16, gap: 12 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  info: { flex: 1, fontSize: 14, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  badges: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  link: { flexDirection: "row", alignItems: "center" },
});
