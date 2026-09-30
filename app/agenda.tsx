import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { StackHeader, HeaderButton } from "@/components/ui/StackHeader";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { Segmented } from "@/components/ui/Segmented";
import { SheetMenu, SheetItem } from "@/components/ui/SheetMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { AgendaCard } from "@/components/agenda/AgendaCard";
import { Agenda, useAgendas } from "@/contexts/AgendaContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { NOW } from "@/data/dummy";
import {
  DAY_NAMES,
  addDaysKey,
  dateKey,
  formatKeyLong,
  keyParts,
} from "@/utils/date";

type Mode = "day" | "upcoming";

const sortAgendas = (list: Agenda[]) =>
  [...list].sort((a, b) =>
    (a.date + a.startTime).localeCompare(b.date + b.startTime),
  );

export default function AgendaScreen() {
  const router = useRouter();
  const { agendas, removeAgenda } = useAgendas();
  const todayKey = dateKey(NOW);

  const [mode, setMode] = useState<Mode>("day");
  const [selected, setSelected] = useState(todayKey);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDaysKey(todayKey, i)),
    [todayKey],
  );
  const dayList = useMemo(
    () => sortAgendas(agendas.filter((a) => a.date === selected)),
    [agendas, selected],
  );
  const upcoming = useMemo(() => {
    const groups: { date: string; items: Agenda[] }[] = [];
    sortAgendas(agendas.filter((a) => a.date >= todayKey)).forEach((a) => {
      const last = groups[groups.length - 1];
      if (last && last.date === a.date) last.items.push(a);
      else groups.push({ date: a.date, items: [a] });
    });
    return groups;
  }, [agendas, todayKey]);

  const menuItem = agendas.find((a) => a.id === menuId);
  const deleteItem = agendas.find((a) => a.id === deleteId);

  const menuItems: SheetItem[] = [
    { key: "edit", label: "Edit Agenda", icon: "edit-2" },
    { key: "delete", label: "Hapus Agenda", icon: "trash-2", danger: true },
  ];

  const edit = (id: number) =>
    router.push({ pathname: "/add-agenda", params: { id: String(id) } });

  const onMenuSelect = (key: string) => {
    const id = menuId;
    setMenuId(null);
    if (id === null) return;
    if (key === "edit") edit(id);
    if (key === "delete") setTimeout(() => setDeleteId(id), 250);
  };

  const groupLabel = (date: string) =>
    date === todayKey
      ? "Hari Ini"
      : date === addDaysKey(todayKey, 1)
        ? "Besok"
        : formatKeyLong(date);

  const card = (a: Agenda) => (
    <AgendaCard
      key={a.id}
      item={a}
      removing={removingId === a.id}
      onPress={edit}
      onMore={setMenuId}
      onRemoved={(id) => {
        removeAgenda(id);
        setRemovingId(null);
        setToast("Agenda dihapus");
      }}
    />
  );

  return (
    <Screen
      header={
        <StackHeader
          title="Agenda"
          right={
            <HeaderButton
              icon="plus"
              label="Tambah agenda"
              onPress={() => router.push("/add-agenda")}
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
            title="Hapus agenda ini?"
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
        <FadeInView>
          <Segmented<Mode>
            value={mode}
            onChange={setMode}
            options={[
              { key: "day", label: "Per Hari" },
              { key: "upcoming", label: "Mendatang" },
            ]}
          />
        </FadeInView>

        {mode === "day" ? (
          <>
            <FadeInView delay={60}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
              >
                {days.map((k) => {
                  const p = keyParts(k);
                  const on = k === selected;
                  const has = agendas.some((a) => a.date === k);
                  return (
                    <Pressable
                      key={k}
                      onPress={() => setSelected(k)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      style={[styles.day, on ? styles.dayOn : styles.dayOff]}
                    >
                      <AppText
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 12,
                          color: on
                            ? "rgba(255,255,255,0.85)"
                            : colors.textMuted,
                        }}
                      >
                        {DAY_NAMES[p.weekday].slice(0, 3)}
                      </AppText>
                      <AppText
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: 20,
                          lineHeight: 26,
                          color: on ? "#fff" : colors.text,
                        }}
                      >
                        {p.d}
                      </AppText>
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor: has
                              ? on
                                ? colors.accent
                                : colors.primary
                              : "transparent",
                          },
                        ]}
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </FadeInView>

            <FadeInView delay={120} style={{ gap: 12 }}>
              <View style={styles.between}>
                <AppText style={styles.section}>
                  {formatKeyLong(selected)}
                </AppText>
                <AppText style={styles.count}>{dayList.length} agenda</AppText>
              </View>
              {dayList.length === 0 ? (
                <View style={styles.empty}>
                  <Feather
                    name="calendar"
                    size={32}
                    color={colors.primaryMuted}
                  />
                  <AppText color={colors.textMuted}>
                    Belum ada agenda di hari ini.
                  </AppText>
                  <Pressable onPress={() => router.push("/add-agenda")}>
                    <AppText
                      style={{
                        fontFamily: fonts.semibold,
                        color: colors.primary,
                      }}
                    >
                      Tambah agenda
                    </AppText>
                  </Pressable>
                </View>
              ) : (
                dayList.map((a, i) => (
                  <FadeInView key={a.id} delay={Math.min(i, 6) * 60}>
                    {card(a)}
                  </FadeInView>
                ))
              )}
            </FadeInView>
          </>
        ) : upcoming.length === 0 ? (
          <FadeInView delay={60} style={styles.empty}>
            <Feather name="calendar" size={32} color={colors.primaryMuted} />
            <AppText color={colors.textMuted}>
              Belum ada agenda mendatang.
            </AppText>
          </FadeInView>
        ) : (
          upcoming.map((g, gi) => (
            <FadeInView
              key={g.date}
              delay={Math.min(gi, 5) * 80 + 60}
              style={{ gap: 10 }}
            >
              <AppText style={styles.section}>{groupLabel(g.date)}</AppText>
              {g.items.map(card)}
            </FadeInView>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: {
    width: 58,
    alignItems: "center",
    gap: 2,
    paddingVertical: 10,
    borderRadius: radius.lg,
  },
  dayOn: {
    backgroundColor: colors.primary,
    ...shadow.primary,
    shadowOpacity: 0.18,
    elevation: 3,
  },
  dayOff: { backgroundColor: colors.surface, ...shadow.card },
  dot: { width: 6, height: 6, borderRadius: 3 },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 24 },
  count: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary },
  empty: { alignItems: "center", gap: 8, paddingVertical: 40 },
});
