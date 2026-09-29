import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";

type Stats = { total: number; pending: number; progress: number; done: number };

export function StatsRow({ stats }: { stats: Stats }) {
  const items = [
    {
      value: stats.total,
      label: "Total",
      fg: colors.primary,
      bg: "transparent",
    },
    {
      value: stats.pending,
      label: "Pending",
      fg: "#8A5A00",
      bg: colors.accentSoft,
    },
    {
      value: stats.progress,
      label: "Proses",
      fg: colors.primary,
      bg: "#E6E0FF",
    },
    { value: stats.done, label: "Selesai", fg: colors.primary, bg: "#E6E0FF" },
  ];

  return (
    <View style={styles.row}>
      {items.map((it) => (
        <View key={it.label} style={styles.box}>
          <View style={[styles.numBox, { backgroundColor: it.bg }]}>
            <AppText
              style={{
                fontFamily: fonts.bold,
                fontSize: 28,
                lineHeight: 36,
                color: it.fg,
              }}
            >
              {it.value}
            </AppText>
          </View>
          <AppText
            style={{
              fontFamily: fonts.medium,
              fontSize: 14,
              color: colors.textMuted,
            }}
          >
            {it.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  box: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  numBox: {
    minWidth: 40,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
});
