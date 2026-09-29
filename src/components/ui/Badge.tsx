import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { colors, fonts, radius } from "@/constants/theme";

export type Tone = "danger" | "warning" | "primary" | "success" | "neutral";

const palette: Record<Tone, { bg: string; fg: string }> = {
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  warning: { bg: colors.accentSoft, fg: "#8A5A00" },
  primary: { bg: "#E6E0FF", fg: colors.primary },
  success: { bg: colors.successSoft, fg: colors.success },
  neutral: { bg: "#ECEAF5", fg: colors.textMuted },
};

export function Badge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: Tone;
}) {
  const p = palette[tone];
  return (
    <View style={[styles.badge, { backgroundColor: p.bg }]}>
      <AppText
        style={{
          fontFamily: fonts.semibold,
          fontSize: 12,
          lineHeight: 16,
          color: p.fg,
        }}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
});
