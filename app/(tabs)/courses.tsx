import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppText } from "@/components/ui/AppText";
import { Chip } from "@/components/ui/Chip";
import { FadeInView } from "@/components/ui/FadeInView";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { CourseCard, CourseStats } from "@/components/courses/CourseCard";
import { useCourses } from "@/contexts/CoursesContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useTasks } from "@/contexts/TasksContext";
import { colors, fonts, radius } from "@/constants/theme";
import { NOW } from "@/data/dummy";
import { daysLeft, weekdayWib } from "@/utils/date";
import { CardGrid } from "@/components/layout/CardGrid";
import { SearchBox } from "@/components/ui/SearchBox";

type Filter = "all" | "urgent" | "today";

export default function CoursesScreen() {
  const router = useRouter();
 const { courses, loading, error, refreshCourses, removeCourse } = useCourses();
  const { tasks, removeByCourse } = useTasks();
  const { profile } = useProfile();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Statistik tugas per matkul, dihitung dari data
  const stats = useMemo(() => {
    const map = new Map<number, CourseStats>();
    courses.forEach((c) => map.set(c.id, { active: 0, urgent: 0, done: 0 }));
    tasks.forEach((t) => {
      const s = map.get(t.courseId);
      if (!s) return;
      if (t.status === "completed") s.done += 1;
      else {
        s.active += 1;
        if (daysLeft(t.deadline, NOW) <= 3) s.urgent += 1;
      }
    });
    return map;
  }, [courses, tasks]);

  const today = weekdayWib(NOW);
  const urgentCount = courses.filter(
    (c) => (stats.get(c.id)?.urgent ?? 0) > 0,
  ).length;
  const todayCount = courses.filter((c) => c.day === today).length;
  const totalActive = courses.reduce(
    (n, c) => n + (stats.get(c.id)?.active ?? 0),
    0,
  );
  const totalSks = courses.reduce((n, c) => n + c.sks, 0);

    const visible = useMemo(() => {
      const q = query.trim().toLowerCase();
      return courses.filter((c) => {
        if (filter === "urgent" && !((stats.get(c.id)?.urgent ?? 0) > 0))
          return false;
        if (filter === "today" && c.day !== today) return false;
        if (
          q &&
          !(
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.lecturer.toLowerCase().includes(q)
          )
        )
          return false;
        return true;
      });
    }, [courses, stats, filter, today, query]);

  // Tips: matkul dengan deadline dekat terbanyak
  const tipCourse = useMemo(() => {
    let best: { name: string; n: number } | null = null;
    courses.forEach((c) => {
      const n = stats.get(c.id)?.urgent ?? 0;
      if (n > 0 && (!best || n > best.n)) best = { name: c.name, n };
    });
    return best as { name: string; n: number } | null;
  }, [courses, stats]);

  const menuCourse = courses.find((c) => c.id === menuId);
  const deleteCourse = courses.find((c) => c.id === deleteId);
  const deleteTaskCount = tasks.filter((t) => t.courseId === deleteId).length;

  const menuItems: SheetItem[] = [
    { key: "tasks", label: "Lihat Tugas", icon: "list" },
    { key: "edit", label: "Edit Matkul", icon: "edit-2" },
    { key: "delete", label: "Hapus Matkul", icon: "trash-2", danger: true },
  ];

  const openTasks = (id: number) =>
    router.push({
      pathname: "/tasks",
      params: { courseId: String(id), t: String(Date.now()) },
    });

  const onMenuSelect = (key: string) => {
    const id = menuId;
    setMenuId(null);
    if (id === null) return;
    if (key === "tasks") openTasks(id);
    if (key === "edit")
      router.push({ pathname: "/add-course", params: { id: String(id) } });
    if (key === "delete") setTimeout(() => setDeleteId(id), 250);
  };

  const confirmDelete = () => {
    setRemovingId(deleteId);
    setDeleteId(null);
  };

  const handleRemoved = (id: number) => {
    removeCourse(id);
    removeByCourse(id);
    setRemovingId(null);
    setToast("Mata kuliah dihapus");
  };

  return (
    <Screen
      header={<AppHeader title="Mata Kuliah" />}
      fab
      overlay={
        <>
          <Toast message={toast} onHide={() => setToast(null)} />
          <SheetMenu
            visible={menuId !== null}
            title={menuCourse?.name}
            items={menuItems}
            onClose={() => setMenuId(null)}
            onSelect={onMenuSelect}
          />
          <ConfirmDialog
            visible={deleteId !== null}
            title="Hapus mata kuliah?"
            message={
              deleteTaskCount > 0
                ? `"${deleteCourse?.name ?? ""}" dan ${deleteTaskCount} tugas terkait akan dihapus permanen.`
                : `"${deleteCourse?.name ?? ""}" akan dihapus dan tidak bisa dikembalikan.`
            }
            onCancel={() => setDeleteId(null)}
            onConfirm={confirmDelete}
          />
        </>
      }
    >
      <View style={{ gap: 20 }}>
        {/* Banner */}
        <FadeInView>
          <View style={styles.banner}>
            <Feather
              name="star"
              size={28}
              color="rgba(255,200,87,0.9)"
              style={styles.sparkle}
            />
            <View style={styles.bannerPill}>
              <Feather name="star" size={13} color="#fff" />
              <AppText
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 13,
                  color: "#fff",
                }}
              >
                Semester {profile.semester} • Fokus Prestasi
              </AppText>
            </View>
            <AppText style={styles.bannerTitle}>
              Tetap Semangat, {profile.name.split(" ")[0]}! ✨
            </AppText>
            <AppText style={styles.bannerText}>
              {totalActive > 0
                ? `Langkah kecil hari ini membuka jalan kelulusan gemilang. Kamu punya ${totalActive} tugas aktif menantimu berkembang!`
                : "Semua tugasmu sudah beres. Hebat, pertahankan ritmenya!"}
            </AppText>
          </View>
        </FadeInView>

        {/* Ringkasan + tombol tambah */}
        <FadeInView delay={80} style={styles.summaryRow}>
          <View style={{ flex: 1 }}>
            <AppText style={styles.overline}>KURIKULUM AKTIF</AppText>
            <View style={styles.titleRow}>
              <AppText style={styles.count}>
                {courses.length} Mata Kuliah
              </AppText>
              <View style={styles.sksPill}>
                <AppText
                  style={{
                    fontFamily: fonts.semibold,
                    fontSize: 12,
                    color: colors.primary,
                  }}
                >
                  {totalSks} SKS
                </AppText>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/add-course")}
            accessibilityRole="button"
            style={styles.addBtn}
          >
            <Feather name="plus-circle" size={18} color="#fff" />
            <AppText
              style={{
                fontFamily: fonts.semibold,
                fontSize: 14,
                color: "#fff",
              }}
            >
              Tambah Matkul
            </AppText>
          </Pressable>
        </FadeInView>

        {/* Filter */}
        <FadeInView delay={110}>
          <SearchBox
            value={query}
            onChangeText={setQuery}
            placeholder="Cari matkul, kode, atau dosen"
          />
        </FadeInView>
        <FadeInView delay={140}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
          >
            <Chip
              label={`Semua (${courses.length})`}
              selected={filter === "all"}
              onPress={() => {
                setFilter("all");
                setQuery("");
              }}
            />
            <Chip
              label={`Tugas Mendesak (${urgentCount})`}
              selected={filter === "urgent"}
              onPress={() => {
                setFilter("urgent");
                setQuery("");
              }}
            />
            <Chip
              label={`Jadwal Hari Ini (${todayCount})`}
              selected={filter === "today"}
              onPress={() => {
                setFilter("today");
                setQuery("");
              }}
            />
          </ScrollView>
        </FadeInView>

        {/* Daftar */}
        {loading ? (
          <FadeInView delay={200} style={styles.empty}>
            <AppText color={colors.textMuted}>Memuat mata kuliah...</AppText>
          </FadeInView>
        ) : error ? (
          <FadeInView delay={200} style={styles.empty}>
            <Feather name="alert-circle" size={32} color={colors.danger} />
            <AppText color={colors.textMuted}>{error}</AppText>
            <Pressable onPress={refreshCourses}>
              <AppText
                style={{
                  fontFamily: fonts.semibold,
                  color: colors.primary,
                }}
              >
                Coba Lagi
              </AppText>
            </Pressable>
          </FadeInView>
        ) : visible.length === 0 ? (
          <FadeInView delay={200} style={styles.empty}>
            <Feather name="book-open" size={32} color={colors.primaryMuted} />
            <AppText color={colors.textMuted}>
              {courses.length === 0
                ? "Belum ada mata kuliah."
                : "Tidak ada mata kuliah yang cocok."}
            </AppText>
            {courses.length > 0 && filter !== "all" && (
              <Pressable onPress={() => setFilter("all")}>
                <AppText
                  style={{
                    fontFamily: fonts.semibold,
                    color: colors.primary,
                  }}
                >
                  Tampilkan semua
                </AppText>
              </Pressable>
            )}
          </FadeInView>
        ) : (
          <CardGrid>
            {visible.map((c, i) => (
              <FadeInView key={c.id} delay={Math.min(i, 6) * 60 + 200}>
                <CourseCard
                  course={c}
                  stats={stats.get(c.id) ?? { active: 0, urgent: 0, done: 0 }}
                  removing={removingId === c.id}
                  onOpenTasks={openTasks}
                  onMore={setMenuId}
                  onRemoved={handleRemoved}
                />
              </FadeInView>
            ))}
          </CardGrid>
        )}
        {/* Tips */}
        {tipCourse && (
          <FadeInView delay={480}>
            <View style={styles.tip}>
              <View style={styles.tipIcon}>
                <Feather name="zap" size={20} color="#8A5A00" />
              </View>
              <AppText style={{ flex: 1, fontSize: 14, lineHeight: 21 }}>
                <AppText style={{ fontFamily: fonts.bold }}>
                  Tips Aziwa:{" "}
                </AppText>
                Kerjakan tugas matkul{" "}
                <AppText style={{ fontFamily: fonts.semibold }}>
                  {tipCourse.name}
                </AppText>{" "}
                terlebih dahulu karena memiliki {tipCourse.n} deadline terdekat!
              </AppText>
            </View>
          </FadeInView>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: 20,
    gap: 8,
    overflow: "hidden",
  },
  sparkle: { position: "absolute", top: 16, right: 18 },
  bannerPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  bannerTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    color: "#fff",
  },
  bannerText: { fontSize: 14, lineHeight: 22, color: "rgba(255,255,255,0.88)" },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  overline: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  count: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34 },
  sksPill: {
    backgroundColor: "#E6E0FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  empty: { alignItems: "center", gap: 8, paddingVertical: 40 },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryField,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
