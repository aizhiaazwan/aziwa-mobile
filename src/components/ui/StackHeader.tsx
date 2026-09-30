import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors, radius, spacing } from "@/constants/theme";
import type { IconName } from "@/data/dummy";
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function StackHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  const { contentMax } = useBreakpoint();
  const router = useRouter();
  const back = () =>
    router.canGoBack() ? router.back() : router.replace("/home");

  return (
    <View style={styles.bar}>
      <View style={[styles.row, { maxWidth: contentMax }]}>
        <Pressable
          onPress={back}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={styles.back}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading" style={{ flex: 1 }}>
          {title}
        </AppText>
        {right}
      </View>
    </View>
  );
}

export function HeaderButton({
  icon,
  onPress,
  label,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.action}
    >
      <Feather name={icon} size={22} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  back: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  action: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
