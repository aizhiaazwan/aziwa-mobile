import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { StackHeader, HeaderButton } from "@/components/ui/StackHeader";
import { AppText } from "@/components/ui/AppText";
import { Chip } from "@/components/ui/Chip";
import { FadeInView } from "@/components/ui/FadeInView";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteTag, tagMeta, useNotes } from "@/contexts/NotesContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { CardGrid } from "@/components/layout/CardGrid";

const tags = Object.keys(tagMeta) as NoteTag[];

export default function NotesScreen() {
  const router = useRouter();
  const { notes, removeNote } = useNotes();

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<NoteTag | "all">("all");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => {
        if (tag !== "all" && n.tag !== tag) return false;
        if (
          q &&
          !(
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
          )
        )
          return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id); // terbaru di atas
  }, [notes, query, tag]);

  const menuNote = notes.find((n) => n.id === menuId);
  const deleteNote = notes.find((n) => n.id === deleteId);
  const menuItems: SheetItem[] = [
    { key: "edit", label: "Edit Catatan", icon: "edit-2" },
    { key: "delete", label: "Hapus Catatan", icon: "trash-2", danger: true },
  ];

  const edit = (id: number) =>
    router.push({ pathname: "/add-note", params: { id: String(id) } });

  const onMenuSelect = (key: string) => {
    const id = menuId;
    setMenuId(null);
    if (id === null) return;
    if (key === "edit") edit(id);
    if (key === "delete") setTimeout(() => setDeleteId(id), 250);
  };

  return (
    <Screen
      header={
        <StackHeader
          title="Catatan"
          right={
            <HeaderButton
              icon="plus"
              label="Tambah catatan"
              onPress={() => router.push("/add-note")}
            />
          }
        />
      }
      overlay={
        <>
          <Toast message={toast} onHide={() => setToast(null)} />
          <SheetMenu
            visible={menuId !== null}
            title={menuNote?.title}
            items={menuItems}
            onClose={() => setMenuId(null)}
            onSelect={onMenuSelect}
          />
          <ConfirmDialog
            visible={deleteId !== null}
            title="Hapus catatan ini?"
            message={`"${deleteNote?.title ?? ""}" akan dihapus dan tidak bisa dikembalikan.`}
            onCancel={() => setDeleteId(null)}
            onConfirm={() => {
              setRemovingId(deleteId);
              setDeleteId(null);
            }}
          />
        </>
      }
    >
      <View style={{ gap: 16 }}>
        <FadeInView>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cari judul atau isi catatan"
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
        </FadeInView>

        <FadeInView delay={60}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
          >
            <Chip
              label="Semua"
              selected={tag === "all"}
              onPress={() => setTag("all")}
            />
            {tags.map((t) => (
              <Chip
                key={t}
                label={tagMeta[t].label}
                selected={tag === t}
                onPress={() => setTag(t)}
              />
            ))}
          </ScrollView>
        </FadeInView>

        {visible.length === 0 ? (
          <FadeInView delay={120} style={styles.empty}>
            <Feather name="file-text" size={32} color={colors.primaryMuted} />
            <AppText color={colors.textMuted}>
              {notes.length === 0
                ? "Belum ada catatan."
                : "Tidak ada catatan yang cocok."}
            </AppText>
            {notes.length === 0 && (
              <Pressable onPress={() => router.push("/add-note")}>
                <AppText
                  style={{ fontFamily: fonts.semibold, color: colors.primary }}
                >
                  Buat catatan pertama
                </AppText>
              </Pressable>
            )}
          </FadeInView>
        ) : (
          <CardGrid>
            {visible.map((n, i) => (
              <FadeInView key={n.id} delay={Math.min(i, 6) * 60 + 120}>
                <NoteCard
                  note={n}
                  removing={removingId === n.id}
                  onPress={edit}
                  onMore={setMenuId}
                  onRemoved={(id) => {
                    removeNote(id);
                    setRemovingId(null);
                    setToast("Catatan dihapus");
                  }}
                />
              </FadeInView>
            ))}
          </CardGrid>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
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
  empty: { alignItems: "center", gap: 8, paddingVertical: 40 },
});
