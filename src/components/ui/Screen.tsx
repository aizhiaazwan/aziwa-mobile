import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/constants/theme";
import { FadeInView } from "./FadeInView";
import { Fab } from "./Fab";
import { useRouter } from "expo-router";

type Props = {
  overlay?: ReactNode;
  children: ReactNode;
  header?: ReactNode;
  scroll?: boolean;
  fab?: boolean;
  onFabPress?: () => void;
};

export function Screen({
  children,
  header,
  scroll = true,
  fab = false,
  onFabPress,
  overlay,
}: Props) {
      const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInView style={styles.inner}>{children}</FadeInView>
        </ScrollView>
      ) : (
        <FadeInView style={[styles.inner, styles.fill]}>{children}</FadeInView>
      )}
            {fab && <Fab onPress={onFabPress ?? (() => router.push('/add-task'))} />}
        {overlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: spacing.lg, paddingBottom: 100 },
  inner: { width: "100%", maxWidth: 720, alignSelf: "center" },
  fill: { flex: 1, padding: spacing.lg },
});
