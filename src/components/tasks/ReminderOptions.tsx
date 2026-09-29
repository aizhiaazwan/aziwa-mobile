import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius } from "@/constants/theme";

export const reminderChoices = [
  { key: "1d", label: "1 hari sebelum" },
  { key: "3h", label: "3 jam sebelum" },
  { key: "1h", label: "1 jam sebelum" },
] as const;

export type ReminderKey = (typeof reminderChoices)[number]["key"];

type Props = { selected: ReminderKey[]; onToggle: (k: ReminderKey) => void };

export function ReminderOptions({ selected, onToggle }: Props) {
  return (
    <View style={styles.wrap}>
      {reminderChoices.map((c) => {
        const on = selected.includes(c.key);
        return (
          <Pressable
            key={c.key}
            onPress={() => onToggle(c.key)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            style={[styles.chip, on ? styles.on : styles.off]}
          >
            <Feather
              name={on ? "check-circle" : "plus"}
              size={18}
              color={on ? colors.primary : colors.textMuted}
            />
            <AppText
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: on ? colors.primary : colors.text,
              }}
            >
              {c.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  on: { backgroundColor: "#E6E0FF" },
  off: { backgroundColor: colors.primaryField },
});
