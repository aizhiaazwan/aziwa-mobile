import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { FormField } from "@/components/ui/FormField";
import { FormScreen } from "@/components/ui/FormScreen";
import { AppInput } from "@/components/ui/AppInput";
import { PickRow } from "@/components/ui/PickRow";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { DateTimeSheet } from "@/components/ui/DateTimeSheet";
import { NoteTag, tagMeta, useNotes } from "@/contexts/NotesContext";
import { fonts } from "@/constants/theme";
import { NOW } from "@/data/dummy";
import { dateKey, formatKeyLong, keyToYMD, ymdToKey } from "@/utils/date";
import { useGoBack } from "@/utils/nav";

const tags = Object.keys(tagMeta) as NoteTag[];

export default function AddNoteScreen() {
  const goBack = useGoBack();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { notes, addNote, updateNote } = useNotes();
  const editing = id ? notes.find((n) => n.id === Number(id)) : undefined;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [tag, setTag] = useState<NoteTag>(editing?.tag ?? "kuliah");
  const [date, setDate] = useState(editing?.date ?? dateKey(NOW));

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
      setError("Judul catatan wajib diisi.");
      setShakeKey((k) => k + 1);
      return;
    }
    setSaving(true);
    // Simulasi jeda jaringan. Di Phase 4 diganti panggilan API.
    timer.current = setTimeout(() => {
      const data = { title: title.trim(), content: content.trim(), tag, date };
      if (editing) updateNote(editing.id, data);
      else addNote(data);
      setSaving(false);
      setToast(editing ? "Perubahan disimpan" : "Catatan disimpan");
      timer.current = setTimeout(() => goBack(), 900);
    }, 500);
  };

  return (
    <FormScreen
      title={editing ? "Edit Catatan" : "Catatan Baru"}
      toast={toast}
      onToastHide={() => setToast(null)}
      overlay={
        <DateTimeSheet
          mode="date"
          visible={dateSheet}
          value={keyToYMD(date)}
          onClose={() => setDateSheet(false)}
          onConfirm={(v) => {
            setDate(ymdToKey(v));
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
            placeholder="Contoh: Catatan Machine Learning"
            maxLength={60}
            error={!!error}
          />
        </FormField>
      </FadeInView>

      <FadeInView delay={60} style={{ gap: 8 }}>
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
          Tag
        </AppText>
        <View style={styles.wrap}>
          {tags.map((t) => (
            <Chip
              key={t}
              label={tagMeta[t].label}
              selected={tag === t}
              onPress={() => setTag(t)}
            />
          ))}
        </View>
      </FadeInView>

      <FadeInView delay={120}>
        <PickRow
          icon="calendar"
          label="Tanggal"
          value={formatKeyLong(date)}
          onPress={() => setDateSheet(true)}
        />
      </FadeInView>

      <FadeInView delay={180}>
        <FormField label="Isi Catatan">
          <AppInput
            value={content}
            onChangeText={setContent}
            placeholder="Tulis catatanmu di sini..."
            multiline
            style={{ minHeight: 220 }}
          />
        </FormField>
      </FadeInView>

      <FadeInView delay={240} style={{ gap: 12 }}>
        <Button
          label={editing ? "Simpan Perubahan" : "Simpan Catatan"}
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
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cancel: { height: 48, alignItems: "center", justifyContent: "center" },
});
