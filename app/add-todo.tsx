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
import { Segmented } from "@/components/ui/Segmented";
import { Button } from "@/components/ui/Button";
import { DateTimeSheet } from "@/components/ui/DateTimeSheet";
import { useTodos } from "@/contexts/TodosContext";
import { colors, fonts, radius } from "@/constants/theme";
import { NOW, Priority, Status } from "@/data/dummy";
import { dateKey, formatKeyLong, keyToYMD, ymdToKey } from "@/utils/date";

export default function AddTodoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { todos, addTodo, updateTodo } = useTodos();
  const editing = id ? todos.find((t) => t.id === Number(id)) : undefined;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [useDeadline, setUseDeadline] = useState(!!editing?.deadline);
  const [deadline, setDeadline] = useState(editing?.deadline ?? dateKey(NOW));
  const [priority, setPriority] = useState<Priority>(
    editing?.priority ?? "medium",
  );
  const [status, setStatus] = useState<Status>(editing?.status ?? "pending");

  const [dateSheet, setDateSheet] = useState(false);
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

  const handleSave = () => {
    if (saving) return;
    if (!title.trim()) {
      setError("Judul to-do wajib diisi.");
      setShakeKey((k) => k + 1);
      return;
    }
    setSaving(true);
    // Simulasi jeda jaringan. Di Phase 4 diganti panggilan API.
    timer.current = setTimeout(() => {
      const data = {
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: useDeadline ? deadline : undefined,
        priority,
        status,
      };
      if (editing) updateTodo(editing.id, data);
      else addTodo(data);
      setSaving(false);
      setToast(editing ? "Perubahan disimpan" : "To-do ditambahkan");
      timer.current = setTimeout(() => router.back(), 900);
    }, 500);
  };

  return (
    <FormScreen
      title={editing ? "Edit To-Do" : "Tambah To-Do"}
      toast={toast}
      onToastHide={() => setToast(null)}
      overlay={
        <DateTimeSheet
          mode="date"
          visible={dateSheet}
          value={keyToYMD(deadline)}
          onClose={() => setDateSheet(false)}
          onConfirm={(v) => {
            setDeadline(ymdToKey(v));
            setDateSheet(false);
          }}
        />
      }
    >
      <FadeInView>
        <FormField
          label="Judul"
          required
          right={`${title.length}/60`}
          error={error}
          shakeKey={shakeKey}
        >
          <AppInput
            value={title}
            onChangeText={(v) => {
              setTitle(v.slice(0, 60));
              if (error) setError(undefined);
            }}
            placeholder="Contoh: Belajar Cisco"
            maxLength={60}
            error={!!error}
          />
        </FormField>
      </FadeInView>

      <FadeInView delay={60}>
        <FormField label="Deskripsi">
          <AppInput
            value={description}
            onChangeText={setDescription}
            placeholder="Catatan singkat (opsional)..."
            multiline
          />
        </FormField>
      </FadeInView>

      <FadeInView delay={120} style={{ gap: 8 }}>
        <View style={styles.deadlineHead}>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontFamily: fonts.bold, fontSize: 16 }}>
              Pakai Deadline
            </AppText>
            <AppText variant="caption" style={{ fontSize: 13 }}>
              Boleh dikosongkan untuk aktivitas bebas
            </AppText>
          </View>
          <Toggle value={useDeadline} onChange={setUseDeadline} />
        </View>
        {useDeadline && (
          <FadeInView>
            <PickRow
              icon="calendar"
              label="Tanggal"
              value={formatKeyLong(deadline)}
              onPress={() => setDateSheet(true)}
            />
          </FadeInView>
        )}
      </FadeInView>

      <FadeInView delay={180} style={{ gap: 8 }}>
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

      <FadeInView delay={240} style={{ gap: 8 }}>
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
          Status
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

      <FadeInView delay={300} style={{ gap: 12 }}>
        <Button
          label={editing ? "Simpan Perubahan" : "Simpan To-Do"}
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
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  deadlineHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
  },
  cancel: { height: 48, alignItems: "center", justifyContent: "center" },
});
