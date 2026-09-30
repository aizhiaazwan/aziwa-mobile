import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { useReminders } from "@/contexts/RemindersContext";
import { useTasks } from "@/contexts/TasksContext";
import { useAgendas } from "@/contexts/AgendaContext";
import { colors, fonts, radius } from "@/constants/theme";
import { NOW } from "@/data/dummy";
import { resolveTarget, triggerIso } from "@/utils/reminder";
import { CardGrid } from "@/components/layout/CardGrid";

type Filter = "all" | "on" | "off";

export default function RemindersScreen() {
  const router = useRouter();
  const { reminders, toggleReminder, removeReminder } = useReminders();
  const { tasks } = useTasks();
  const { agendas } = useAgendas();

  const [filter, setFilter] = useState<Filter>("all");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      reminders.map((r) => {
        const target = resolveTarget(r.kind, r.targetId, tasks, agendas);
        const trigger = target ? triggerIso(target.whenIso, r.offset) : null;
        return {
          r,
          target,
          trigger,
          past: trigger ? new Date(trigger) < NOW : false,
        };
      }),
    [reminders, tasks, agendas],
  );

  const visible = useMemo(
    () =>
      rows
        .filter((x) =>
          filter === "on"
            ? x.r.enabled
            : filter === "off"
              ? !x.r.enabled
              : true,
        )
        .sort((a, b) => {
          if (!a.trigger) return 1;
          if (!b.trigger) return -1;
          return a.trigger.localeCompare(b.trigger);
        }),
    [rows, filter],
  );

  const activeCount = reminders.filter((r) => r.enabled).length;
  const menuTitle =
    rows.find((x) => x.r.id === menuId)?.target?.title ?? "Pengingat";
  const deleteTitle =
    rows.find((x) => x.r.id === deleteId)?.target?.title ?? "pengingat ini";

  const menuItems: SheetItem[] = [
    { key: "edit", label: "Edit Pengingat", icon: "edit-2" },
    { key: "delete", label: "Hapus Pengingat", icon: "trash-2", danger: true },
  ];

  const edit = (id: number) =>
    router.push({ pathname: "/add-reminder", params: { id: String(id) } });

  const onMenuSelect = (key: string) => {
    const id = menuId;
    setMenuId(null);
    if (id === null) return;
    if (key === "edit") edit(id);
    if (key === "delete") setTimeout(() => setDeleteId(id), 250);
  };

  const handleToggle = (id: number) => {
    const r = reminders.find((x) => x.id === id);
    toggleReminder(id);
    setToast(r?.enabled ? "Pengingat dinonaktifkan" : "Pengingat diaktifkan");
  };

  return (
    <Screen
      header={
        <StackHeader
          title="Pengingat"
          right={
            <HeaderButton
              icon="plus"
              label="Tambah pengingat"
              onPress={() => router.push("/add-reminder")}
            />
          }
        />
      }
      overlay={
        <>
          <Toast message={toast} onHide={() => setToast(null)} />
          <SheetMenu
            visible={menuId !== null}
            title={menuTitle}
            items={menuItems}
            onClose={() => setMenuId(null)}
            onSelect={onMenuSelect}
          />
          <ConfirmDialog
            visible={deleteId !== null}
            title="Hapus pengingat ini?"
            message={`Pengingat untuk "${deleteTitle}" akan dihapus.`}
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
        <FadeInView style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Feather name="bell" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontFamily: fonts.bold, fontSize: 18 }}>
              {activeCount} dari {reminders.length} aktif
            </AppText>
            <AppText variant="caption" style={{ fontSize: 13, lineHeight: 19 }}>
              Pengingat sudah tersimpan. Notifikasi di perangkat mulai berbunyi
              di fase berikutnya.
            </AppText>
          </View>
        </FadeInView>

        <FadeInView delay={60} style={{ flexDirection: "row", gap: 8 }}>
          <Chip
            label="Semua"
            selected={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <Chip
            label="Aktif"
            selected={filter === "on"}
            onPress={() => setFilter("on")}
          />
          <Chip
            label="Nonaktif"
            selected={filter === "off"}
            onPress={() => setFilter("off")}
          />
        </FadeInView>

        {visible.length === 0 ? (
          <FadeInView delay={120} style={styles.empty}>
            <Feather name="bell-off" size={32} color={colors.primaryMuted} />
            <AppText color={colors.textMuted}>
              {reminders.length === 0
                ? "Belum ada pengingat."
                : "Tidak ada pengingat di filter ini."}
            </AppText>
            {reminders.length === 0 && (
              <Pressable onPress={() => router.push("/add-reminder")}>
                <AppText
                  style={{ fontFamily: fonts.semibold, color: colors.primary }}
                >
                  Buat pengingat pertama
                </AppText>
              </Pressable>
            )}
          </FadeInView>
        ) : (
          <CardGrid>
            {visible.map((x, i) => (
              <FadeInView key={x.r.id} delay={Math.min(i, 6) * 60 + 120}>
                <ReminderCard
                  reminder={x.r}
                  target={x.target}
                  trigger={x.trigger}
                  past={x.past}
                  removing={removingId === x.r.id}
                  onToggle={handleToggle}
                  onPress={edit}
                  onMore={setMenuId}
                  onRemoved={(id) => {
                    removeReminder(id);
                    setRemovingId(null);
                    setToast("Pengingat dihapus");
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
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { alignItems: "center", gap: 8, paddingVertical: 40 },
});
