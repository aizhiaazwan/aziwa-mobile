import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppText } from "@/components/ui/AppText";
import { Chip } from "@/components/ui/Chip";
import { FadeInView } from "@/components/ui/FadeInView";
import { GreetingCard } from "@/components/home/GreetingCard";
import { DeadlineBanner } from "@/components/home/DeadlineBanner";
import { StatsRow } from "@/components/home/StatsRow";
import { TipCard } from "@/components/home/TipCard";
import { TaskRowCard } from "@/components/tasks/TaskRowCard";
import { colors, fonts } from "@/constants/theme";
import { NOW, dummyStats } from "@/data/dummy";
import { useCourses } from '@/contexts/CoursesContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useTasks } from "@/contexts/TasksContext";
import {
  daysLeft,
  formatTime,
  hoursLeft,
  isSameDay,
  monthYearLabel,
} from "@/utils/date";
import { QuickLinks } from "@/components/home/QuickLinks";
import { CardGrid } from "@/components/layout/CardGrid";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type Filter = "all" | "today" | "week" | "priority";

export default function HomeScreen() {
  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const { tasks, toggleComplete } = useTasks();
  const { courses } = useCourses();
  const { profile } = useProfile();
  const [filter, setFilter] = useState<Filter>("all");

  const active = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "completed")
        .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline)),
    [tasks],
  );

  const visible = useMemo(() => {
    const list = active.filter((t) => {
      if (filter === "today") return isSameDay(t.deadline, NOW);
      if (filter === "week") return daysLeft(t.deadline, NOW) <= 7;
      if (filter === "priority") return t.priority === "high";
      return true;
    });
    return list.slice(0, 3);
  }, [active, filter]);

  const next = active[0];
  const nextCourse = next && courses.find((c) => c.id === next.courseId);

  const complete = (id: number) =>
    toggleComplete(id);

  return (
    <Screen header={<AppHeader title="Dashboard" />} fab>
      <View style={isDesktop ? { flexDirection: 'row', gap: 20 } : { gap: 20 }}>
          <FadeInView style={isDesktop ? { flex: 1 } : undefined}>
            <GreetingCard 
            name={profile.name.split(" ")[0]}
            semester="Semester Ganjil 2026/2027"/>
          </FadeInView>
          
          {next && nextCourse && (
            <FadeInView delay={80} style={isDesktop ? { flex: 1, justifyContent: 'center' } : undefined}>
              <DeadlineBanner
              label={
                isSameDay(next.deadline, NOW)
                  ? "DEADLINE HARI INI"
                  : "DEADLINE BESOK"
              }
              time={formatTime(next.deadline)}
              title={`${nextCourse.name} — ${next.title}`}
              note={`Tersisa ${hoursLeft(next.deadline, NOW)} jam lagi untuk submit ke portal LMS.`}
            />
            </FadeInView>
          )}
          
        <FadeInView delay={160} style={{ gap: 12 }}>
          <View style={styles.between}>
            <AppText style={styles.section}>Ringkasan Tugas</AppText>
            <AppText style={styles.link}>{monthYearLabel(NOW)}</AppText>
          </View>
          <StatsRow stats={dummyStats} />
        </FadeInView>
        
        <FadeInView delay={200}>
          <QuickLinks />
        </FadeInView>

        <FadeInView delay={240}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
          >
            <Chip
              label="Semua"
              selected={filter === "all"}
              onPress={() => setFilter("all")}
            />
            <Chip
              label="Hari Ini"
              selected={filter === "today"}
              onPress={() => setFilter("today")}
            />
            <Chip
              label="Minggu Ini"
              selected={filter === "week"}
              onPress={() => setFilter("week")}
            />
            <Chip
              label="Prioritas"
              selected={filter === "priority"}
              onPress={() => setFilter("priority")}
              icon={
                <Feather
                  name="star"
                  size={14}
                  color={filter === "priority" ? "#fff" : colors.accent}
                />
              }
            />
          </ScrollView>
        </FadeInView>

        <FadeInView delay={320} style={{ gap: 12 }}>
          <View style={styles.between}>
            <View style={styles.row}>
              <AppText style={styles.section}>Deadline Terdekat</AppText>
              <View style={styles.redDot} />
            </View>
            <Pressable onPress={() => router.push("/tasks")} style={styles.row}>
              <AppText style={styles.link}>Lihat Semua</AppText>
              <Feather name="arrow-right" size={16} color={colors.primary} />
            </Pressable>
          </View>

          {visible.length === 0 ? (
            <View style={styles.empty}>
              <Feather
                name="check-circle"
                size={28}
                color={colors.primaryMuted}
              />
              <AppText color={colors.textMuted}>
                Tidak ada tugas untuk filter ini.
              </AppText>
            </View>
          ) : (<CardGrid>
            {visible.map((t) => (
              <TaskRowCard
                key={t.id}
                task={t}
                course={courses.find((c) => c.id === t.courseId)!}
                urgent={daysLeft(t.deadline, NOW) <= 1}
                onComplete={complete}
              />
            ))}
            </CardGrid>
          )}
        </FadeInView>

        <FadeInView delay={400}>
          <TipCard
            title="Metode Pomodoro 25 Menit"
            text="Fokus tanpa distraksi meningkatkan retensi materi kuliahmu."
          />
        </FadeInView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  section: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
  link: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  empty: { alignItems: "center", gap: 8, paddingVertical: 32 },
});
