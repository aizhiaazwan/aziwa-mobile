import { Pressable, StyleSheet, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors, radius, spacing } from "@/constants/theme";
import { useProfile } from "@/contexts/ProfileContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function AppHeader({ title }: { title: string }) {
       const { profile } = useProfile();
        const { isDesktop, contentMax } = useBreakpoint();
           {
             !isDesktop && (
               <View style={styles.logoBox}>
                 <Ionicons
                   name="school-outline"
                   size={22}
                   color={colors.primary}
                 />
               </View>
             );
           }
  return (
    <View style={styles.bar}>
      <View style={[styles.row, { maxWidth: contentMax }]}>
        <View style={styles.logoBox}>
          <Ionicons name="school-outline" size={22} color={colors.primary} />
        </View>

        <View style={styles.titles}>
          <AppText variant="caption" style={{ lineHeight: 14 }}>
            Aziwa Academic
          </AppText>
          <AppText variant="heading" style={{ lineHeight: 26 }}>
            {title}
          </AppText>
        </View>

        <Pressable style={styles.iconButton} accessibilityLabel="Notifikasi">
          <Feather name="bell" size={22} color={colors.text} />
          <View style={styles.dot} />
        </Pressable>

        <View style={styles.avatar}>
          <AppText variant="label" color={colors.primary}>
            {profile.name.charAt(0).toUpperCase()}
          </AppText>
        </View>
      </View>
    </View>
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
    gap: spacing.md,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  titles: { flex: 1 },
  iconButton: { padding: spacing.xs },
  dot: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
