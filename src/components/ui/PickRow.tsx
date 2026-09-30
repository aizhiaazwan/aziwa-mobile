import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import type { IconName } from "@/data/dummy";

type Props = {
  icon: IconName;
  label: string;
  value: string;
  onPress: () => void;
  error?: boolean;
};

export function PickRow({ icon, label, value, onPress, error }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.row, error && { borderColor: colors.danger }]}
    >
      <View style={styles.icon}>
        <Feather name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="caption">{label}</AppText>
        <AppText
          style={{ fontFamily: fonts.bold, fontSize: 18, lineHeight: 26 }}
        >
          {value}
        </AppText>
      </View>
      <View style={styles.change}>
        <AppText
          style={{
            fontFamily: fonts.semibold,
            fontSize: 14,
            color: colors.primary,
          }}
        >
          Ubah
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: "transparent",
    ...shadow.card,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  change: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
