import { useEffect, useRef, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { FormField } from "@/components/ui/FormField";
import { Segmented } from "@/components/ui/Segmented";
import { Button } from "@/components/ui/Button";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import { DateTimeSheet, HM } from "@/components/ui/DateTimeSheet";
import { Toast } from "@/components/ui/Toast";
import { useCourses } from "@/contexts/CoursesContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { DAY_NAMES } from "@/utils/date";
import { useGoBack } from '@/utils/nav';

type Sks = "1" | "2" | "3" | "4";
const STRIPES = [
  "#5B3DE0",
  "#C99A00",
  "#7B5FD6",
  "#C7B8FF",
  "#8A8AA0",
  "#1FA971",
];
const DAY_KEYS = [1, 2, 3, 4, 5, 6];

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (t: HM) => `${pad(t.hh)}:${pad(t.mm)}`;
const toHM = (s: string): HM => {
  const [hh, mm] = s.split(":").map(Number);
  return { hh, mm };
};
const toMin = (t: HM) => t.hh * 60 + t.mm;

export default function AddCourseScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { courses, addCourse, updateCourse } = useCourses();
  const editing = id ? courses.find((c) => c.id === Number(id)) : undefined;

  const [name, setName] = useState(editing?.name ?? "");
  const [code, setCode] = useState(editing?.code ?? "");
  const [lecturer, setLecturer] = useState(editing?.lecturer ?? "");
  const [sks, setSks] = useState<Sks>(String(editing?.sks ?? 3) as Sks);
  const [day, setDay] = useState(editing?.day ?? 1);
  const [start, setStart] = useState<HM>(
    editing ? toHM(editing.startTime) : { hh: 8, mm: 0 },
  );
  const [end, setEnd] = useState<HM>(
    editing ? toHM(editing.endTime) : { hh: 10, mm: 30 },
  );
  const [room, setRoom] = useState(editing?.room ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");

  const [sheet, setSheet] = useState<"day" | "start" | "end" | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    code?: string;
    time?: string;
  }>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const dayItems: SheetItem[] = DAY_KEYS.map((d) => ({
    key: String(d),
    label: DAY_NAMES[d],
    icon: "calendar",
    selected: day === d,
  }));

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Nama mata kuliah wajib diisi.";
    if (!code.trim()) e.code = "Kode mata kuliah wajib diisi.";
    if (toMin(end) <= toMin(start))
      e.time = "Jam selesai harus setelah jam mulai.";
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
      const data = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        lecturer: lecturer.trim(),
        sks: Number(sks),
        day,
        startTime: fmt(start),
        endTime: fmt(end),
        room: room.trim(),
        description: description.trim() || undefined,
      };
      if (editing) {
        updateCourse(editing.id, data);
      } else {
        addCourse({
          ...data,
          icon: "book",
          tone: "primary",
          stripe: STRIPES[courses.length % STRIPES.length],
        });
      }
      setSaving(false);
      setToast(editing ? "Perubahan disimpan" : "Mata kuliah ditambahkan");
      timer.current = setTimeout(() => goBack(), 900);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => goBack()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={styles.back}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading" style={{ flex: 1 }}>
          {editing ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
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
              <FormField
                label="Nama Mata Kuliah"
                required
                right={`${name.length}/60`}
                error={errors.name}
                shakeKey={shakeKey}
              >
                <TextInput
                  value={name}
                  onChangeText={(v) => {
                    setName(v.slice(0, 60));
                    if (errors.name)
                      setErrors((e) => ({ ...e, name: undefined }));
                  }}
                  placeholder="Contoh: Web Programming"
                  placeholderTextColor={colors.textPlaceholder}
                  maxLength={60}
                  style={[styles.input, errors.name && styles.inputError]}
                />
              </FormField>
            </FadeInView>

            <FadeInView delay={60}>
              <FormField
                label="Kode Mata Kuliah"
                required
                error={errors.code}
                shakeKey={shakeKey}
              >
                <TextInput
                  value={code}
                  onChangeText={(v) => {
                    setCode(v.slice(0, 12));
                    if (errors.code)
                      setErrors((e) => ({ ...e, code: undefined }));
                  }}
                  placeholder="Contoh: IF3201"
                  placeholderTextColor={colors.textPlaceholder}
                  autoCapitalize="characters"
                  style={[styles.input, errors.code && styles.inputError]}
                />
              </FormField>
            </FadeInView>

            <FadeInView delay={120}>
              <FormField label="Dosen Pengampu">
                <TextInput
                  value={lecturer}
                  onChangeText={setLecturer}
                  placeholder="Contoh: Dr. Irwan Santoso, M.T."
                  placeholderTextColor={colors.textPlaceholder}
                  style={styles.input}
                />
              </FormField>
            </FadeInView>

            <FadeInView delay={180} style={{ gap: 8 }}>
              <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
                SKS
              </AppText>
              <Segmented<Sks>
                value={sks}
                onChange={setSks}
                options={[
                  { key: "1", label: "1" },
                  { key: "2", label: "2" },
                  { key: "3", label: "3" },
                  { key: "4", label: "4" },
                ]}
              />
            </FadeInView>

            <FadeInView delay={240}>
              <FormField label="Jadwal" error={errors.time} shakeKey={shakeKey}>
                <Pressable
                  onPress={() => setSheet("day")}
                  accessibilityRole="button"
                  style={[styles.input, styles.select]}
                >
                  <Feather name="calendar" size={18} color={colors.primary} />
                  <AppText style={{ flex: 1, fontSize: 15 }}>
                    {DAY_NAMES[day]}
                  </AppText>
                  <Feather name="chevron-down" size={20} color={colors.text} />
                </Pressable>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TimeBox
                    label="Mulai"
                    value={fmt(start)}
                    onPress={() => setSheet("start")}
                    error={!!errors.time}
                  />
                  <TimeBox
                    label="Selesai"
                    value={fmt(end)}
                    onPress={() => setSheet("end")}
                    error={!!errors.time}
                  />
                </View>
              </FormField>
            </FadeInView>

            <FadeInView delay={300}>
              <FormField label="Ruang">
                <TextInput
                  value={room}
                  onChangeText={setRoom}
                  placeholder="Contoh: Lab Kom 3"
                  placeholderTextColor={colors.textPlaceholder}
                  style={styles.input}
                />
              </FormField>
            </FadeInView>

            <FadeInView delay={360}>
              <FormField label="Deskripsi">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Catatan singkat tentang mata kuliah ini..."
                  placeholderTextColor={colors.textPlaceholder}
                  multiline
                  textAlignVertical="top"
                  style={[styles.input, { minHeight: 96 }]}
                />
              </FormField>
            </FadeInView>

            <FadeInView delay={420} style={{ gap: 12 }}>
              <Button
                label={editing ? "Simpan Perubahan" : "Simpan Mata Kuliah"}
                loading={saving}
                onPress={handleSave}
                iconLeft={<Feather name="save" size={20} color="#fff" />}
              />
              <Pressable
                onPress={() => goBack()}
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
        visible={sheet === "day"}
        title="Pilih Hari"
        items={dayItems}
        onClose={() => setSheet(null)}
        onSelect={(k) => {
          setDay(Number(k));
          setSheet(null);
        }}
      />
      <DateTimeSheet
        mode="time"
        visible={sheet === "start"}
        value={start}
        onClose={() => setSheet(null)}
        onConfirm={(v) => {
          setStart(v);
          setErrors((e) => ({ ...e, time: undefined }));
          setSheet(null);
        }}
      />
      <DateTimeSheet
        mode="time"
        visible={sheet === "end"}
        value={end}
        onClose={() => setSheet(null)}
        onConfirm={(v) => {
          setEnd(v);
          setErrors((e) => ({ ...e, time: undefined }));
          setSheet(null);
        }}
      />
      <Toast message={toast} onHide={() => setToast(null)} />
    </SafeAreaView>
  );
}

function TimeBox({
  label,
  value,
  onPress,
  error,
}: {
  label: string;
  value: string;
  onPress: () => void;
  error?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.input, styles.timeBox, error && styles.inputError]}
    >
      <Feather name="clock" size={18} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <AppText variant="caption">{label}</AppText>
        <AppText
          style={{ fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 }}
        >
          {value} WIB
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
  select: { flexDirection: "row", alignItems: "center", gap: 12 },
  timeBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  cancel: { height: 48, alignItems: "center", justifyContent: "center" },
});
