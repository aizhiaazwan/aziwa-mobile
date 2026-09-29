import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { FormField } from "@/components/ui/FormField";
import { Segmented } from "@/components/ui/Segmented";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import { DateTimeSheet, HM, YMD } from "@/components/ui/DateTimeSheet";
import { Toast } from "@/components/ui/Toast";
import {
  ReminderKey,
  ReminderOptions,
} from "@/components/tasks/ReminderOptions";
import { useTasks } from "@/contexts/TasksContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
   import { NOW, Priority, Status } from "@/data/dummy";
      import { useCourses } from "@/contexts/CoursesContext";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const pad = (n: number) => String(n).padStart(2, "0");

// Tanggal default = hari ini (dummy NOW, zona WIB), waktu default 23:59
const wib = new Date(NOW.getTime() + 7 * 3600 * 1000);
const defaultDate: YMD = {
  y: wib.getUTCFullYear(),
  m: wib.getUTCMonth(),
  d: wib.getUTCDate(),
};

const reminderText: Record<ReminderKey, string> = {
  "1d": "H-1 Reminder",
  "3h": "H-3 Jam",
  "1h": "H-1 Jam",
};

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();
     const { courses } = useCourses();
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<YMD>(defaultDate);
  const [time, setTime] = useState<HM>({ hh: 23, mm: 59 });
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("pending");
  const [smart, setSmart] = useState(true);
  const [reminders, setReminders] = useState<ReminderKey[]>(["1d", "3h"]);

  const [sheet, setSheet] = useState<"course" | "date" | "time" | null>(null);
  const [errors, setErrors] = useState<{ title?: string; course?: string }>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const courseItems: SheetItem[] = courses.map((c) => ({
    key: String(c.id),
    label: c.name,
    icon: c.icon,
    selected: courseId === c.id,
  }));
  const courseName = courses.find((c) => c.id === courseId)?.name;

  const toggleReminder = (k: ReminderKey) =>
    setReminders((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );

  const validate = () => {
    const e: { title?: string; course?: string } = {};
    if (!title.trim()) e.title = "Judul tugas wajib diisi.";
    if (courseId === null) e.course = "Pilih mata kuliah terlebih dahulu.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (saving) return;
    if (!validate()) {
      setShakeKey((k) => k + 1);
      return;
    }
    setSaving(true);
    // Simulasi jeda jaringan singkat. Di Phase 4 diganti panggilan API.
    timer.current = setTimeout(() => {
      const deadline = `${date.y}-${pad(date.m + 1)}-${pad(date.d)}T${pad(time.hh)}:${pad(time.mm)}:00+07:00`;
      addTask({
        title: title.trim(),
        courseId: courseId!,
        deadline,
        priority,
        status,
        reminder:
          smart && reminders.length ? reminderText[reminders[0]] : undefined,
        completedAt: status === "completed" ? NOW.toISOString() : undefined,
      });
      setSaving(false);
      setToast("Tugas berhasil disimpan");
      timer.current = setTimeout(() => router.back(), 900);
    }, 600);
  };

  const dateText = `${pad(date.d)} ${MONTHS[date.m]} ${date.y}`;
  const timeText = `${pad(time.hh)}:${pad(time.mm)} WIB`;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={styles.back}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading" style={{ flex: 1 }}>
          Tambah Tugas
        </AppText>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <FadeInView>
              <View style={styles.banner}>
                <View style={styles.bannerIcon}>
                  <Feather name="star" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={{ fontFamily: fonts.bold, fontSize: 16 }}>
                    Target Akademik Siap Ditata
                  </AppText>
                  <AppText
                    variant="caption"
                    style={{ fontSize: 13, lineHeight: 19 }}
                  >
                    Lengkapi info tugas agar notifikasi cerdas dapat bekerja
                    tepat waktu.
                  </AppText>
                </View>
              </View>
            </FadeInView>

            <FadeInView delay={60}>
              <FormField
                label="Judul Tugas"
                required
                right={`${title.length}/60`}
                error={errors.title}
                shakeKey={shakeKey}
              >
                <TextInput
                  value={title}
                  onChangeText={(v) => {
                    setTitle(v.slice(0, 60));
                    if (errors.title)
                      setErrors((e) => ({ ...e, title: undefined }));
                  }}
                  placeholder="Contoh: Membuat CRUD Aplikasi Web"
                  placeholderTextColor={colors.textPlaceholder}
                  maxLength={60}
                  style={[styles.input, errors.title && styles.inputError]}
                />
              </FormField>
            </FadeInView>

            <FadeInView delay={120}>
              <FormField
                label="Mata Kuliah"
                required
                error={errors.course}
                shakeKey={shakeKey}
              >
                <Pressable
                  onPress={() => setSheet("course")}
                  accessibilityRole="button"
                  style={[
                    styles.input,
                    styles.select,
                    errors.course && styles.inputError,
                  ]}
                >
                  <AppText
                    style={{
                      flex: 1,
                      fontSize: 15,
                      color: courseName ? colors.text : colors.textPlaceholder,
                    }}
                  >
                    {courseName ?? "Pilih mata kuliah aktif"}
                  </AppText>
                  <Feather name="chevron-down" size={20} color={colors.text} />
                </Pressable>
              </FormField>
            </FadeInView>

            <FadeInView delay={180}>
              <FormField label="Deskripsi & Instruksi">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Jelaskan instruksi tugas, format pengumpulan, atau catatan dosen..."
                  placeholderTextColor={colors.textPlaceholder}
                  multiline
                  textAlignVertical="top"
                  style={[styles.input, styles.textarea]}
                />
              </FormField>
            </FadeInView>

            <FadeInView delay={240} style={{ gap: 8 }}>
              <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
                Tenggat Waktu (Deadline)
                <AppText style={{ color: colors.danger }}> *</AppText>
              </AppText>
              <PickRow
                icon="calendar"
                label="Tanggal"
                value={dateText}
                onPress={() => setSheet("date")}
              />
              <PickRow
                icon="clock"
                label="Waktu"
                value={timeText}
                onPress={() => setSheet("time")}
              />
            </FadeInView>

            <FadeInView delay={300} style={{ gap: 8 }}>
              <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
                Prioritas
              </AppText>
              <Segmented<Priority>
                value={priority}
                onChange={setPriority}
                options={[
                  { key: "low", label: "Rendah", dot: colors.primaryMuted },
                  { key: "medium", label: "Sedang", dot: colors.accent },
                  { key: "high", label: "Tinggi", dot: colors.danger },
                ]}
              />
            </FadeInView>

            <FadeInView delay={360} style={{ gap: 8 }}>
              <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
                Status Pengerjaan
              </AppText>
              <Segmented<Status>
                value={status}
                onChange={setStatus}
                options={[
                  { key: "pending", label: "Pending" },
                  { key: "in_progress", label: "In Progress" },
                  { key: "completed", label: "Selesai" },
                ]}
              />
            </FadeInView>

            <FadeInView delay={420}>
              <View style={styles.reminderCard}>
                <View style={styles.reminderHead}>
                  <View style={styles.bellBox}>
                    <Feather name="bell" size={22} color="#8A5A00" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText style={{ fontFamily: fonts.bold, fontSize: 16 }}>
                      Pengingat Cerdas
                    </AppText>
                    <AppText variant="caption" style={{ fontSize: 13 }}>
                      Kirim peringatan anti-mepet
                    </AppText>
                  </View>
                  <Toggle value={smart} onChange={setSmart} />
                </View>
                {smart && (
                  <FadeInView>
                    <ReminderOptions
                      selected={reminders}
                      onToggle={toggleReminder}
                    />
                  </FadeInView>
                )}
              </View>
            </FadeInView>

            <FadeInView delay={480} style={{ gap: 12 }}>
              <Button
                label="Simpan Tugas"
                loading={saving}
                onPress={handleSave}
                iconLeft={<Feather name="save" size={20} color="#fff" />}
              />
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                style={styles.cancel}
              >
                <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
                  Batal
                </AppText>
              </Pressable>
            </FadeInView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SheetMenu
        visible={sheet === "course"}
        title="Pilih Mata Kuliah"
        items={courseItems}
        onClose={() => setSheet(null)}
        onSelect={(k) => {
          setCourseId(Number(k));
          setErrors((e) => ({ ...e, course: undefined }));
          setSheet(null);
        }}
      />
      <DateTimeSheet
        mode="date"
        visible={sheet === "date"}
        value={date}
        onClose={() => setSheet(null)}
        onConfirm={(v) => {
          setDate(v);
          setSheet(null);
        }}
      />
      <DateTimeSheet
        mode="time"
        visible={sheet === "time"}
        value={time}
        onClose={() => setSheet(null)}
        onConfirm={(v) => {
          setTime(v);
          setSheet(null);
        }}
      />
      <Toast message={toast} onHide={() => setToast(null)} />
    </SafeAreaView>
  );
}

function PickRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={styles.pickRow}
    >
      <View style={styles.pickIcon}>
        <Feather name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="caption">{label}</AppText>
        <AppText
          style={{ fontFamily: fonts.bold, fontSize: 18, lineHeight: 26 }}
        >
          {value}
        </AppText>
      </View>
      <View style={styles.changeBtn}>
        <AppText
          style={{
            fontFamily: fonts.semibold,
            fontSize: 14,
            color: colors.primary,
          }}
        >
          Ubah
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 16, paddingBottom: 40 },
  inner: { width: "100%", maxWidth: 720, alignSelf: "center", gap: 20 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: "transparent",
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    outlineStyle: "none",
    ...shadow.card,
  } as any,
  inputError: { borderColor: colors.danger },
  select: { flexDirection: "row", alignItems: "center" },
  textarea: { minHeight: 110 },
  pickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  pickIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  changeBtn: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderCard: {
    gap: 14,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  reminderHead: { flexDirection: "row", alignItems: "center", gap: 14 },
  bellBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cancel: { height: 48, alignItems: "center", justifyContent: "center" },
});
