import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { FormField } from "@/components/ui/FormField";
import { FormScreen } from "@/components/ui/FormScreen";
import { AppInput } from "@/components/ui/AppInput";
import { PickRow } from "@/components/ui/PickRow";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { DateTimeSheet, HM } from "@/components/ui/DateTimeSheet";
import {
  AgendaCategory,
  categoryMeta,
  useAgendas,
} from "@/contexts/AgendaContext";
import { colors, fonts } from "@/constants/theme";
import { NOW } from "@/data/dummy";
import {
  dateKey,
  formatHM,
  formatKeyLong,
  keyToYMD,
  parseHM,
  toMinutes,
  ymdToKey,
} from "@/utils/date";
import { useGoBack } from "@/utils/nav";

const categories = Object.keys(categoryMeta) as AgendaCategory[];

export default function AddAgendaScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { agendas, addAgenda, updateAgenda } = useAgendas();
  const editing = id ? agendas.find((a) => a.id === Number(id)) : undefined;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState<AgendaCategory>(
    editing?.category ?? "kuliah",
  );
  const [date, setDate] = useState(editing?.date ?? dateKey(NOW));
  const [start, setStart] = useState<HM>(
    editing ? parseHM(editing.startTime) : { hh: 9, mm: 0 },
  );
  const [end, setEnd] = useState<HM>(
    editing ? parseHM(editing.endTime) : { hh: 10, mm: 0 },
  );
  const [description, setDescription] = useState(editing?.description ?? "");
  const [reminder, setReminder] = useState(editing?.reminder ?? false);

  const [sheet, setSheet] = useState<"date" | "start" | "end" | null>(null);
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});
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

  const handleSave = () => {
    if (saving) return;
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Judul agenda wajib diisi.";
    if (toMinutes(end) <= toMinutes(start))
      e.time = "Jam selesai harus setelah jam mulai.";
    setErrors(e);
    if (Object.keys(e).length) {
      setShakeKey((k) => k + 1);
      return;
    }
    setSaving(true);
    // Simulasi jeda jaringan. Di Phase 4 diganti panggilan API.
    timer.current = setTimeout(() => {
      const data = {
        title: title.trim(),
        category,
        date,
        startTime: formatHM(start),
        endTime: formatHM(end),
        description: description.trim() || undefined,
        reminder,
      };
      if (editing) updateAgenda(editing.id, data);
      else addAgenda(data);
      setSaving(false);
      setToast(editing ? "Perubahan disimpan" : "Agenda ditambahkan");
      timer.current = setTimeout(() => goBack(), 900);
    }, 500);
  };

  return (
    <FormScreen
      title={editing ? "Edit Agenda" : "Tambah Agenda"}
      toast={toast}
      onToastHide={() => setToast(null)}
      overlay={
        <>
          <DateTimeSheet
            mode="date"
            visible={sheet === "date"}
            value={keyToYMD(date)}
            onClose={() => setSheet(null)}
            onConfirm={(v) => {
              setDate(ymdToKey(v));
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
              setErrors((x) => ({ ...x, time: undefined }));
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
              setErrors((x) => ({ ...x, time: undefined }));
              setSheet(null);
            }}
          />
        </>
      }
    >
      <FadeInView>
        <FormField
          label="Judul Agenda"
          required
          right={`${title.length}/60`}
          error={errors.title}
          shakeKey={shakeKey}
        >
          <AppInput
            value={title}
            onChangeText={(v) => {
              setTitle(v.slice(0, 60));
              if (errors.title) setErrors((x) => ({ ...x, title: undefined }));
            }}
            placeholder="Contoh: Rapat organisasi"
            maxLength={60}
            error={!!errors.title}
          />
        </FormField>
      </FadeInView>

      <FadeInView delay={60} style={{ gap: 8 }}>
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
          Kategori
        </AppText>
        <View style={styles.wrap}>
          {categories.map((c) => (
            <Chip
              key={c}
              label={categoryMeta[c].label}
              selected={category === c}
              onPress={() => setCategory(c)}
            />
          ))}
        </View>
      </FadeInView>

      <FadeInView delay={120} style={{ gap: 8 }}>
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
          Waktu
        </AppText>
        <PickRow
          icon="calendar"
          label="Tanggal"
          value={formatKeyLong(date)}
          onPress={() => setSheet("date")}
        />
        <PickRow
          icon="clock"
          label="Mulai"
          value={`${formatHM(start)} WIB`}
          onPress={() => setSheet("start")}
          error={!!errors.time}
        />
        <PickRow
          icon="clock"
          label="Selesai"
          value={`${formatHM(end)} WIB`}
          onPress={() => setSheet("end")}
          error={!!errors.time}
        />
        {errors.time ? (
          <AppText
            style={{
              fontFamily: fonts.medium,
              fontSize: 13,
              color: colors.danger,
            }}
          >
            {errors.time}
          </AppText>
        ) : null}
      </FadeInView>

      <FadeInView delay={180}>
        <FormField label="Deskripsi">
          <AppInput
            value={description}
            onChangeText={setDescription}
            placeholder="Lokasi atau catatan singkat..."
            multiline
          />
        </FormField>
      </FadeInView>

      <FadeInView delay={240}>
        <View style={styles.reminder}>
          <View style={styles.bell}>
            <Feather name="bell" size={22} color="#8A5A00" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontFamily: fonts.bold, fontSize: 16 }}>
              Ingatkan Saya
            </AppText>
            <AppText variant="caption" style={{ fontSize: 13 }}>
              Notifikasi sebelum agenda dimulai
            </AppText>
          </View>
          <Toggle value={reminder} onChange={setReminder} />
        </View>
      </FadeInView>

      <FadeInView delay={300} style={{ gap: 12 }}>
        <Button
          label={editing ? "Simpan Perubahan" : "Simpan Agenda"}
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
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  reminder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 24,
  },
  bell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cancel: { height: 48, alignItems: "center", justifyContent: "center" },
});
