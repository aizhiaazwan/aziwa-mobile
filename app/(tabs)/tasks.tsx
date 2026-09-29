import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppText } from "@/components/ui/AppText";
import { Chip } from "@/components/ui/Chip";
import { FadeInView } from "@/components/ui/FadeInView";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { TaskListCard } from "@/components/tasks/TaskListCard";
import { useTasks } from "@/contexts/TasksContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { NOW, dummyCourses, Priority, Status, Task } from "@/data/dummy";
import { daysLeft, isSameDay } from "@/utils/date";

type StatusFilter = "all" | Status;
type DeadlineFilter = "all" | "today" | "week" | "overdue";
type Sort = "deadline" | "priority" | "newest";
type SheetKind = "course" | "sort" | "filter" | "task" | null;

const sortLabel: Record<Sort, string> = {
  deadline: "Deadline Terdekat",
  priority: "Prioritas",
  newest: "Terbaru",
};
const priorityRank: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

function buildTaskItems(task?: Task): SheetItem[] {
  const items: SheetItem[] = [];
  if (!task) return items;
  if (task.status === "pending")
    items.push({ key: "start", label: "Mulai Dikerjakan", icon: "play" });
  items.push(
    task.status === "completed"
      ? { key: "toggle", label: "Buka Kembali", icon: "rotate-ccw" }
      : { key: "toggle", label: "Tandai Selesai", icon: "check-circle" },
  );
  items.push({
    key: "delete",
    label: "Hapus Tugas",
    icon: "trash-2",
    danger: true,
  });
  return items;
}

export default function TasksScreen() {
  const { tasks, toggleComplete, setStatus, removeTask } = useTasks();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [deadline, setDeadline] = useState<DeadlineFilter>("all");
  const [sort, setSort] = useState<Sort>("deadline");

  const [sheet, setSheet] = useState<SheetKind>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tasks.filter((t) => {
      const course = dummyCourses.find((c) => c.id === t.courseId);
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (courseId !== null && t.courseId !== courseId) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (deadline === "today" && !isSameDay(t.deadline, NOW)) return false;
      if (deadline === "week" && daysLeft(t.deadline, NOW) > 7) return false;
      if (
        deadline === "overdue" &&
        !(new Date(t.deadline) < NOW && t.status !== "completed")
      )
        return false;
      if (
        q &&
        !(
          t.title.toLowerCase().includes(q) ||
          course?.name.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });

    return list.sort((a, b) => {
      // Tugas selesai selalu di bawah
      const doneDiff =
        Number(a.status === "completed") - Number(b.status === "completed");
      if (doneDiff) return doneDiff;
      if (sort === "priority") {
        const d = priorityRank[b.priority] - priorityRank[a.priority];
        if (d) return d;
      }
      if (sort === "newest") return b.id - a.id; // id terbesar = terbaru (sementara)
      return +new Date(a.deadline) - +new Date(b.deadline);
    });
  }, [tasks, query, statusFilter, courseId, priority, deadline, sort]);

  const filterActive = priority !== "all" || deadline !== "all";
  const anyFilter =
    filterActive || statusFilter !== "all" || courseId !== null || query !== "";

  const resetAll = () => {
    setQuery("");
    setStatusFilter("all");
    setCourseId(null);
    setPriority("all");
    setDeadline("all");
  };

  const activeTask = tasks.find((t) => t.id === activeId);
  const deleteTask = tasks.find((t) => t.id === deleteId);
  const courseName =
    courseId === null
      ? "Semua Matkul"
      : dummyCourses.find((c) => c.id === courseId)?.name;

  // ----- isi sheet -----
  const courseItems: SheetItem[] = [
    {
      key: "all",
      label: "Semua Matkul",
      icon: "layers",
      selected: courseId === null,
    },
    ...dummyCourses.map((c) => ({
      key: String(c.id),
      label: c.name,
      icon: c.icon,
      selected: courseId === c.id,
    })),
  ];
  const sortItems: SheetItem[] = [
    {
      key: "deadline",
      label: "Deadline Terdekat",
      icon: "clock",
      selected: sort === "deadline",
    },
    {
      key: "priority",
      label: "Prioritas",
      icon: "flag",
      selected: sort === "priority",
    },
    {
      key: "newest",
      label: "Terbaru",
      icon: "plus-circle",
      selected: sort === "newest",
    },
  ];
  const filterItems: SheetItem[] = [
    {
      key: "p:all",
      label: "Semua Prioritas",
      icon: "flag",
      section: "Prioritas",
      selected: priority === "all",
    },
    {
      key: "p:high",
      label: "Tinggi",
      icon: "arrow-up",
      section: "Prioritas",
      selected: priority === "high",
    },
    {
      key: "p:medium",
      label: "Sedang",
      icon: "minus",
      section: "Prioritas",
      selected: priority === "medium",
    },
    {
      key: "p:low",
      label: "Rendah",
      icon: "arrow-down",
      section: "Prioritas",
      selected: priority === "low",
    },
    {
      key: "d:all",
      label: "Semua Deadline",
      icon: "calendar",
      section: "Deadline",
      selected: deadline === "all",
    },
    {
      key: "d:today",
      label: "Hari Ini",
      icon: "sun",
      section: "Deadline",
      selected: deadline === "today",
    },
    {
      key: "d:week",
      label: "7 Hari ke Depan",
      icon: "calendar",
      section: "Deadline",
      selected: deadline === "week",
    },
    {
      key: "d:overdue",
      label: "Terlewat",
      icon: "alert-circle",
      section: "Deadline",
      selected: deadline === "overdue",
    },
  ];

  // ----- aksi -----
  const handleToggle = (id: number) => {
    const t = tasks.find((x) => x.id === id);
    toggleComplete(id);
    setToast(
      t?.status === "completed"
        ? "Tugas dibuka kembali"
        : "Tugas ditandai selesai",
    );
  };

  const openMore = (id: number) => {
    setActiveId(id);
    setSheet("task");
  };

  const onTaskAction = (key: string) => {
    const id = activeId;
    setSheet(null);
    if (id === null) return;
    if (key === "start") {
      setStatus(id, "in_progress");
      setToast("Tugas mulai dikerjakan");
    } else if (key === "toggle") {
      handleToggle(id);
    } else if (key === "delete") {
      // jeda singkat agar dua Modal tidak bertabrakan di Android
      setTimeout(() => setDeleteId(id), 250);
    }
  };

  const onFilterSelect = (key: string) => {
    setSheet(null);
    const [group, value] = key.split(":");
    if (group === "p") setPriority(value as Priority | "all");
    if (group === "d") setDeadline(value as DeadlineFilter);
  };

  const confirmDelete = () => {
    setRemovingId(deleteId);
    setDeleteId(null);
  };

  const handleRemoved = (id: number) => {
    removeTask(id);
    setRemovingId(null);
    setToast("Tugas dihapus");
  };

  const statusChips: { key: StatusFilter; label: string; dot?: string }[] = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Pending", dot: colors.danger },
    { key: "in_progress", label: "In Progress", dot: colors.accent },
    { key: "completed", label: "Selesai", dot: colors.success },
  ];

  return (
    <Screen
      header={<AppHeader title="Daftar Tugas" />}
      fab // onFabPress diisi di 2D (halaman Tambah Tugas)
      overlay={
        <>
          <Toast message={toast} onHide={() => setToast(null)} />
          <SheetMenu
            visible={sheet === "course"}
            title="Pilih Mata Kuliah"
            items={courseItems}
            onClose={() => setSheet(null)}
            onSelect={(k) => {
              setCourseId(k === "all" ? null : Number(k));
              setSheet(null);
            }}
          />
          <SheetMenu
            visible={sheet === "sort"}
            title="Urutkan"
            items={sortItems}
            onClose={() => setSheet(null)}
            onSelect={(k) => {
              setSort(k as Sort);
              setSheet(null);
            }}
          />
          <SheetMenu
            visible={sheet === "filter"}
            title="Filter Tugas"
            items={filterItems}
            onClose={() => setSheet(null)}
            onSelect={onFilterSelect}
          />
          <SheetMenu
            visible={sheet === "task"}
            title={activeTask?.title}
            items={buildTaskItems(activeTask)}
            onClose={() => setSheet(null)}
            onSelect={onTaskAction}
          />
          <ConfirmDialog
            visible={deleteId !== null}
            title="Hapus tugas ini?"
            message={`"${deleteTask?.title ?? ""}" akan dihapus dan tidak bisa dikembalikan.`}
            onCancel={() => setDeleteId(null)}
            onConfirm={confirmDelete}
          />
        </>
      }
    >
      <View style={{ gap: 16 }}>
        {/* Search + filter */}
        <FadeInView style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cari tugas kuliah, topik, atau mata kuliah"
              placeholderTextColor={colors.textPlaceholder}
              style={styles.searchInput}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => setQuery("")}
                hitSlop={10}
                accessibilityLabel="Hapus pencarian"
              >
                <Feather name="x" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => setSheet("filter")}
            accessibilityRole="button"
            accessibilityLabel="Filter"
            style={styles.filterBtn}
          >
            <Feather name="sliders" size={20} color={colors.text} />
            {filterActive && <View style={styles.filterDot} />}
          </Pressable>
        </FadeInView>

        {/* Chip status */}
        <FadeInView delay={60}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
          >
            {statusChips.map((c) => {
              const selected = statusFilter === c.key;
              const icon = c.dot ? (
                <View
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 5,
                    backgroundColor: c.dot,
                  }}
                />
              ) : (
                <View
                  style={[
                    styles.countBubble,
                    {
                      backgroundColor: selected
                        ? "rgba(255,255,255,0.28)"
                        : colors.primarySoft,
                    },
                  ]}
                >
                  <AppText
                    style={{
                      fontFamily: fonts.semibold,
                      fontSize: 11,
                      lineHeight: 14,
                      color: selected ? "#fff" : colors.primary,
                    }}
                  >
                    {counts.all}
                  </AppText>
                </View>
              );
              return (
                <Chip
                  key={c.key}
                  label={c.label}
                  icon={icon}
                  selected={selected}
                  onPress={() => setStatusFilter(c.key)}
                />
              );
            })}
          </ScrollView>
        </FadeInView>

        {/* Dropdown matkul + sort */}
        <FadeInView delay={120} style={styles.pickRow}>
          <Pressable
            onPress={() => setSheet("course")}
            accessibilityRole="button"
            style={styles.dropdown}
          >
            <AppText
              numberOfLines={1}
              style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14 }}
            >
              {courseName}
            </AppText>
            <Feather name="chevron-down" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => setSheet("sort")}
            accessibilityRole="button"
            style={styles.sortBtn}
          >
            <Feather name="clock" size={16} color={colors.primary} />
            <AppText
              style={{
                fontFamily: fonts.semibold,
                fontSize: 14,
                color: colors.primary,
              }}
              numberOfLines={1}
            >
              {sortLabel[sort]}
            </AppText>
            <Feather name="chevron-down" size={16} color={colors.primary} />
          </Pressable>
        </FadeInView>

        {/* Statistik */}
        <FadeInView delay={180} style={styles.statsRow}>
          <StatBox
            label="Total"
            icon="clipboard"
            value={counts.all}
            suffix="tugas"
            color={colors.primary}
          />
          <StatBox
            label="In Progress"
            icon="clock"
            value={counts.in_progress}
            suffix="aktif"
            color="#E0A100"
          />
          <StatBox
            label="Selesai"
            icon="check-circle"
            value={counts.completed}
            suffix="done 🎉"
            color={colors.success}
          />
        </FadeInView>

        {/* Daftar */}
        {visible.length === 0 ? (
          <FadeInView delay={240} style={styles.empty}>
            <Feather name="inbox" size={32} color={colors.primaryMuted} />
            <AppText color={colors.textMuted}>
              {tasks.length === 0
                ? "Belum ada tugas."
                : "Tidak ada tugas yang cocok."}
            </AppText>
            {anyFilter && tasks.length > 0 && (
              <Pressable onPress={resetAll}>
                <AppText
                  style={{ fontFamily: fonts.semibold, color: colors.primary }}
                >
                  Reset filter
                </AppText>
              </Pressable>
            )}
          </FadeInView>
        ) : (
          visible.map((t, i) => (
            <FadeInView key={t.id} delay={Math.min(i, 6) * 60 + 240}>
              <TaskListCard
                task={t}
                course={dummyCourses.find((c) => c.id === t.courseId)!}
                urgent={daysLeft(t.deadline, NOW) <= 1}
                removing={removingId === t.id}
                onToggle={handleToggle}
                onMore={openMore}
                onRemoved={handleRemoved}
              />
            </FadeInView>
          ))
        )}
      </View>
    </Screen>
  );
}

function StatBox({
  label,
  icon,
  value,
  suffix,
  color,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  value: number;
  suffix: string;
  color: string;
}) {
  return (
    <View style={styles.statBox}>
      <View style={styles.statHead}>
        <AppText
          style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.text }}
        >
          {label}
        </AppText>
        <Feather name={icon} size={16} color={color} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
        <AppText
          style={{
            fontFamily: fonts.bold,
            fontSize: 30,
            lineHeight: 36,
            color,
          }}
        >
          {value}
        </AppText>
        <AppText
          style={{ fontSize: 13, color: colors.textMuted, marginBottom: 5 }}
        >
          {suffix}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", gap: 12 },
  searchBox: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    height: "100%",
    outlineStyle: "none",
  } as any,
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  filterDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  countBubble: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  pickRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  dropdown: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow.card,
  },
  sortBtn: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
  },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: {
    flex: 1,
    gap: 6,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  statHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  empty: { alignItems: "center", gap: 8, paddingVertical: 40 },
});
