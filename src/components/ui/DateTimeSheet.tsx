import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors, fonts, radius } from "@/constants/theme";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Nilai tanggal disimpan sebagai { y, m, d } dan waktu { hh, mm } agar
// tidak terpengaruh zona waktu perangkat.
export type YMD = { y: number; m: number; d: number }; // m: 0-11
export type HM = { hh: number; mm: number };

type DateProps = {
  mode: "date";
  visible: boolean;
  value: YMD;
  onClose: () => void;
  onConfirm: (v: YMD) => void;
};
type TimeProps = {
  mode: "time";
  visible: boolean;
  value: HM;
  onClose: () => void;
  onConfirm: (v: HM) => void;
};

export function DateTimeSheet(props: DateProps | TimeProps) {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      onRequestClose={props.onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={props.onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          {props.mode === "date" ? (
            <DatePane {...props} />
          ) : (
            <TimePane {...props} />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DatePane({ value, onClose, onConfirm }: DateProps) {
  const [view, setView] = useState({ y: value.y, m: value.m });
  const [picked, setPicked] = useState(value);

  useEffect(() => {
    setView({ y: value.y, m: value.m });
    setPicked(value);
  }, [value]);

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay();
    const total = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    const arr: (number | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d++) arr.push(d);
    while (arr.length % 7) arr.push(null);
    return arr;
  }, [view]);

  const shift = (delta: number) =>
    setView((v) => {
      const n = v.m + delta;
      return { y: v.y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 };
    });

  return (
    <>
      <View style={styles.monthRow}>
        <Pressable
          onPress={() => shift(-1)}
          hitSlop={10}
          style={styles.arrow}
          accessibilityLabel="Bulan sebelumnya"
        >
          <Feather name="chevron-left" size={20} color={colors.text} />
        </Pressable>
        <AppText variant="heading">
          {MONTHS[view.m]} {view.y}
        </AppText>
        <Pressable
          onPress={() => shift(1)}
          hitSlop={10}
          style={styles.arrow}
          accessibilityLabel="Bulan berikutnya"
        >
          <Feather name="chevron-right" size={20} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {DAYS.map((d) => (
          <AppText key={d} style={styles.weekCell}>
            {d}
          </AppText>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((d, i) => {
          const selected =
            d !== null &&
            picked.y === view.y &&
            picked.m === view.m &&
            picked.d === d;
          return (
            <View key={i} style={styles.cellWrap}>
              {d !== null && (
                <Pressable
                  onPress={() => setPicked({ y: view.y, m: view.m, d })}
                  accessibilityRole="button"
                  style={[
                    styles.cell,
                    selected && { backgroundColor: colors.primary },
                  ]}
                >
                  <AppText
                    style={{
                      fontFamily: selected ? fonts.bold : fonts.medium,
                      fontSize: 14,
                      color: selected ? "#fff" : colors.text,
                    }}
                  >
                    {d}
                  </AppText>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      <Actions onCancel={onClose} onOk={() => onConfirm(picked)} />
    </>
  );
}

function TimePane({ value, onClose, onConfirm }: TimeProps) {
  const [hh, setHh] = useState(value.hh);
  const [mm, setMm] = useState(value.mm);

  useEffect(() => {
    setHh(value.hh);
    setMm(value.mm);
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <AppText variant="heading" style={{ textAlign: "center" }}>
        {pad(hh)}:{pad(mm)} WIB
      </AppText>
      <View style={styles.timeCols}>
        <Column
          title="Jam"
          items={hours}
          selected={hh}
          onPick={setHh}
          pad={pad}
        />
        <Column
          title="Menit"
          items={minutes}
          selected={mm}
          onPick={setMm}
          pad={pad}
        />
      </View>
      <Actions onCancel={onClose} onOk={() => onConfirm({ hh, mm })} />
    </>
  );
}

function Column({
  title,
  items,
  selected,
  onPick,
  pad,
}: {
  title: string;
  items: number[];
  selected: number;
  onPick: (n: number) => void;
  pad: (n: number) => string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <AppText style={styles.colTitle}>{title}</AppText>
      <ScrollView style={{ height: 200 }} showsVerticalScrollIndicator={false}>
        {items.map((n) => {
          const on = n === selected;
          return (
            <Pressable
              key={n}
              onPress={() => onPick(n)}
              accessibilityRole="button"
              style={[
                styles.timeItem,
                on && { backgroundColor: colors.primary },
              ]}
            >
              <AppText
                style={{
                  fontFamily: on ? fonts.bold : fonts.medium,
                  fontSize: 16,
                  color: on ? "#fff" : colors.text,
                }}
              >
                {pad(n)}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function Actions({
  onCancel,
  onOk,
}: {
  onCancel: () => void;
  onOk: () => void;
}) {
  return (
    <View style={styles.actions}>
      <Pressable
        onPress={onCancel}
        accessibilityRole="button"
        style={[styles.btn, { backgroundColor: colors.primaryField }]}
      >
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 15 }}>
          Batal
        </AppText>
      </Pressable>
      <Pressable
        onPress={onOk}
        accessibilityRole="button"
        style={[styles.btn, { backgroundColor: colors.primary }]}
      >
        <AppText
          style={{ fontFamily: fonts.semibold, fontSize: 15, color: "#fff" }}
        >
          Pilih
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(27,27,58,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: 20,
    paddingBottom: 28,
    gap: 14,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  weekRow: { flexDirection: "row" },
  weekCell: {
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cellWrap: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  cell: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  timeCols: { flexDirection: "row", gap: 12 },
  colTitle: {
    textAlign: "center",
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  timeItem: {
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  actions: { flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
