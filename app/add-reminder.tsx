import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { FormField } from "@/components/ui/FormField";
import { FormScreen } from "@/components/ui/FormScreen";
import { Segmented } from "@/components/ui/Segmented";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import {
  ReminderKind,
  ReminderOffset,
  offsetMeta,
  useReminders,
} from "@/contexts/RemindersContext";
import { useTasks } from "@/contexts/TasksContext";
import { useAgendas } from "@/contexts/AgendaContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { NOW } from "@/data/dummy";
import { dateKey, formatDeadline } from "@/utils/date";
import { resolveTarget, triggerIso } from "@/utils/reminder";
import { useGoBack } from "@/utils/nav";

const offsets = Object.keys(offsetMeta) as ReminderOffset[];

export default function AddReminderScreen() {
  const goBack = useGoBack();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { reminders, addReminder, updateReminder } = useReminders();
  const { tasks } = useTasks();
  const { agendas } = useAgendas();
  const editing = id ? reminders.find((r) => r.id === Number(id)) : undefined;
  const todayKey = dateKey(NOW);

  const [kind, setKind] = useState<ReminderKind>(editing?.kind ?? "task");
  const [targetId, setTargetId] = useState<number | null>(
    editing?.targetId ?? null,
  );
  const [offset, setOffset] = useState<ReminderOffset>(editing?.offset ?? "1d");
  const [enabled, setEnabled] = useState(editing?.enabled ?? true);

  const [sheet, setSheet] = useState(false);
  const [error, setError] = useState<string>();
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

  const items: SheetItem[] = useMemo(
    () =>
      kind === "task"
        ? tasks
            .filter((t) => t.status !== "completed" || t.id === targetId)
            .map((t) => ({
              key: String(t.id),
              label: t.title,
              icon: "check-circle" as const,
              selected: t.id === targetId,
            }))
        : agendas
            .filter((a) => a.date >= todayKey || a.id === targetId)
            .map((a) => ({
              key: String(a.id),
              label: a.title,
              icon: "calendar" as const,
              selected: a.id === targetId,
            })),
    [kind, tasks, agendas, targetId, todayKey],
  );

  const target =
    targetId !== null ? resolveTarget(kind, targetId, tasks, agendas) : null;
  const trigger = target ? triggerIso(target.whenIso, offset) : null;
  const past = trigger ? new Date(trigger) < NOW : false;
  const noun = kind === "task" ? "tugas" : "agenda";

  const openTargets = () => {
    if (items.length === 0) {
      setError(`Belum ada ${noun} yang bisa dipilih.`);
      setShakeKey((k) => k + 1);
      return;
    }
    setSheet(true);
  };

  const changeKind = (k: ReminderKind) => {
    setKind(k);
    setTargetId(null);
    setError(undefined);
  };

  const handleSave = () => {
    if (saving) return;
    if (targetId === null || !target) {
      setError(`Pilih ${noun} terlebih dahulu.`);
      setShakeKey((k) => k + 1);
      return;
    }
    setSaving(true);
    // Simulasi jeda jaringan. Di Phase 4 diganti panggilan API.
    timer.current = setTimeout(() => {
      const data = { kind, targetId, offset, enabled };
      if (editing) updateReminder(editing.id, data);
      else addReminder(data);
      setSaving(false);
      setToast(editing ? "Perubahan disimpan" : "Pengingat dibuat");
      timer.current = setTimeout(() => goBack(), 900);
    }, 500);
  };

  return (
    <FormScreen
      title={editing ? "Edit Pengingat" : "Tambah Pengingat"}
      toast={toast}
      onToastHide={() => setToast(null)}
      overlay={
        <SheetMenu
          visible={sheet}
          title={kind === "task" ? "Pilih Tugas" : "Pilih Agenda"}
          items={items}
          onClose={() => setSheet(false)}
          onSelect={(k) => {
            setTargetId(Number(k));
            setError(undefined);
            setSheet(false);
          }}
        />
      }
    >
      <FadeInView style={{ gap: 8 }}>
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
          Pengingat untuk
        </AppText>
        <Segmented<ReminderKind>
          value={kind}
          onChange={changeKind}
          options={[
            { key: "task", label: "Tugas" },
            { key: "agenda", label: "Agenda" },
          ]}
        />
      </FadeInView>

      <FadeInView delay={60}>
        <FormField
          label={kind === "task" ? "Pilih Tugas" : "Pilih Agenda"}
          required
          error={error}
          shakeKey={shakeKey}
        >
          <Pressable
            onPress={openTargets}
            accessibilityRole="button"
            style={[styles.select, !!error && { borderColor: colors.danger }]}
          >
            <Feather
              name={kind === "task" ? "check-circle" : "calendar"}
              size={18}
              color={colors.primary}
            />
            <AppText
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 15,
                color: target ? colors.text : colors.textPlaceholder,
              }}
            >
              {target ? target.title : `Pilih ${noun}`}
            </AppText>
            <Feather name="chevron-down" size={20} color={colors.text} />
          </Pressable>
        </FormField>
      </FadeInView>

      <FadeInView delay={120} style={{ gap: 8 }}>
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
          Ingatkan
        </AppText>
        <View style={styles.wrap}>
          {offsets.map((o) => (
            <Chip
              key={o}
              label={offsetMeta[o].label}
              selected={offset === o}
              onPress={() => setOffset(o)}
            />
          ))}
        </View>
        {trigger && (
          <View
            style={[
              styles.preview,
              past && { backgroundColor: colors.accentSoft },
            ]}
          >
            <Feather
              name="bell"
              size={16}
              color={past ? "#8A5A00" : colors.primary}
            />
            <AppText style={{ flex: 1, fontSize: 13, lineHeight: 19 }}>
              {past
                ? `Waktu ini sudah lewat (${formatDeadline(trigger)}), pengingat tidak akan berbunyi.`
                : `Berbunyi ${formatDeadline(trigger)}`}
            </AppText>
          </View>
        )}
      </FadeInView>

      <FadeInView delay={180}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontFamily: fonts.bold, fontSize: 16 }}>
              Aktifkan Pengingat
            </AppText>
            <AppText variant="caption" style={{ fontSize: 13 }}>
              Bisa dimatikan kapan saja
            </AppText>
          </View>
          <Toggle value={enabled} onChange={setEnabled} />
        </View>
      </FadeInView>

      <FadeInView delay={240} style={{ gap: 12 }}>
        <Button
          label={editing ? "Simpan Perubahan" : "Simpan Pengingat"}
          loading={saving}
          onPress={handleSave}
          iconLeft={<Feather name="save" size={20} color="#fff" />}
        />
        <Pressable
          onPress={goBack}
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
  select: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: "transparent",
    ...shadow.card,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  cancel: { height: 48, alignItems: "center", justifyContent: "center" },
});
