import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { StackHeader, HeaderButton } from "@/components/ui/StackHeader";
import { AppText } from "@/components/ui/AppText";
import { AppInput } from "@/components/ui/AppInput";
import { Chip } from "@/components/ui/Chip";
import { FadeInView } from "@/components/ui/FadeInView";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { TodoRow } from "@/components/todos/TodoRow";
import { useTodos } from "@/contexts/TodosContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { NOW, Priority } from "@/data/dummy";
import { dateKey } from "@/utils/date";
import { CardGrid } from "@/components/layout/CardGrid";

type Filter = "all" | "active" | "done";
const rank: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

export default function TodosScreen() {
  const router = useRouter();
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();
  const todayKey = dateKey(NOW);

  const [filter, setFilter] = useState<Filter>("all");
  const [quick, setQuick] = useState("");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const total = todos.length;
  const done = todos.filter((t) => t.status === "completed").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const bar = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(bar, {
      toValue: pct,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, bar]);

  const visible = useMemo(() => {
    const list = todos.filter((t) =>
      filter === "active"
        ? t.status !== "completed"
        : filter === "done"
          ? t.status === "completed"
          : true,
    );
    return list.sort((a, b) => {
      const d =
        Number(a.status === "completed") - Number(b.status === "completed");
      if (d) return d;
      const p = rank[b.priority] - rank[a.priority];
      if (p) return p;
      return (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999");
    });
  }, [todos, filter]);

  const menuItem = todos.find((t) => t.id === menuId);
  const deleteItem = todos.find((t) => t.id === deleteId);
  const menuItems: SheetItem[] = [
    { key: "edit", label: "Edit To-Do", icon: "edit-2" },
    { key: "delete", label: "Hapus To-Do", icon: "trash-2", danger: true },
  ];

  const edit = (id: number) =>
    router.push({ pathname: "/add-todo", params: { id: String(id) } });

  const onMenuSelect = (key: string) => {
    const id = menuId;
    setMenuId(null);
    if (id === null) return;
    if (key === "edit") edit(id);
    if (key === "delete") setTimeout(() => setDeleteId(id), 250);
  };

  const submitQuick = () => {
    const t = quick.trim();
    if (!t) return;
    addTodo({ title: t.slice(0, 60), priority: "medium", status: "pending" });
    setQuick("");
    setToast("To-do ditambahkan");
  };

  return (
    <Screen
      header={
        <StackHeader
          title="To-Do List"
          right={
            <HeaderButton
              icon="plus"
              label="Tambah to-do"
              onPress={() => router.push("/add-todo")}
            />
          }
        />
      }
      overlay={
        <>
          <Toast message={toast} onHide={() => setToast(null)} />
          <SheetMenu
            visible={menuId !== null}
            title={menuItem?.title}
            items={menuItems}
            onClose={() => setMenuId(null)}
            onSelect={onMenuSelect}
          />
          <ConfirmDialog
            visible={deleteId !== null}
            title="Hapus to-do ini?"
            message={`"${deleteItem?.title ?? ""}" akan dihapus dan tidak bisa dikembalikan.`}
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
        <FadeInView style={styles.progress}>
          <View style={styles.between}>
            <AppText style={{ fontFamily: fonts.bold, fontSize: 16 }}>
              Progres Hari Ini
            </AppText>
            <AppText
              style={{
                fontFamily: fonts.semibold,
                fontSize: 14,
                color: colors.primary,
              }}
            >
              {done}/{total} selesai
            </AppText>
          </View>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                {
                  width: bar.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </FadeInView>

        <FadeInView delay={60} style={styles.quickRow}>
          <View style={{ flex: 1 }}>
            <AppInput
              value={quick}
              onChangeText={setQuick}
              placeholder="Tambah aktivitas cepat..."
              maxLength={60}
              returnKeyType="done"
              onSubmitEditing={submitQuick}
            />
          </View>
          <Pressable
            onPress={submitQuick}
            accessibilityRole="button"
            accessibilityLabel="Tambah"
            style={styles.send}
          >
            <Feather name="plus" size={24} color="#fff" />
          </Pressable>
        </FadeInView>

        <FadeInView delay={120} style={{ flexDirection: "row", gap: 8 }}>
          <Chip
            label="Semua"
            selected={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <Chip
            label="Aktif"
            selected={filter === "active"}
            onPress={() => setFilter("active")}
          />
          <Chip
            label="Selesai"
            selected={filter === "done"}
            onPress={() => setFilter("done")}
          />
        </FadeInView>

        {visible.length === 0 ? (
          <FadeInView delay={180} style={styles.empty}>
            <Feather
              name="check-square"
              size={32}
              color={colors.primaryMuted}
            />
            <AppText color={colors.textMuted}>
              {total === 0
                ? "Belum ada to-do."
                : "Tidak ada to-do di filter ini."}
            </AppText>
          </FadeInView>
        ) : (
          <CardGrid>
            {visible.map((t, i) => (
              <FadeInView key={t.id} delay={Math.min(i, 6) * 60 + 180}>
                <TodoRow
                  todo={t}
                  todayKey={todayKey}
                  removing={removingId === t.id}
                  onToggle={toggleTodo}
                  onPress={edit}
                  onMore={setMenuId}
                  onRemoved={(id) => {
                    removeTodo(id);
                    setRemovingId(null);
                    setToast("To-do dihapus");
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
  progress: {
    gap: 10,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DCD5FF",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },
  quickRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  send: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.primary,
  },
  empty: { alignItems: "center", gap: 8, paddingVertical: 40 },
});
