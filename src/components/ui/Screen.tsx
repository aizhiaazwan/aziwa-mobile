import { ReactNode, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing } from "@/constants/theme";
import { addItems } from "@/constants/addMenu";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { FadeInView } from "./FadeInView";
import { Fab } from "./Fab";
import { SheetMenu } from "./SheetMenu";

type Props = {
  children: ReactNode;
  header?: ReactNode;
  scroll?: boolean;
  fab?: boolean;
  onFabPress?: () => void;
  overlay?: ReactNode;
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
  const { isDesktop, contentMax } = useBreakpoint();
  const [addMenu, setAddMenu] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.scrollDesktop,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInView style={[styles.inner, { maxWidth: contentMax }]}>
            {children}
          </FadeInView>
        </ScrollView>
      ) : (
        <FadeInView
          style={[styles.inner, styles.fill, { maxWidth: contentMax }]}
        >
          {children}
        </FadeInView>
      )}
      {/* Di desktop, tombol Tambah Baru ada di sidebar */}
      {fab && !isDesktop && (
        <Fab onPress={onFabPress ?? (() => setAddMenu(true))} />
      )}
      {overlay}
      <SheetMenu
        visible={addMenu}
        title="Tambah Baru"
        items={addItems}
        onClose={() => setAddMenu(false)}
        onSelect={(route) => {
          setAddMenu(false);
          router.push(route as any);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: spacing.lg, paddingBottom: 100 },
  scrollDesktop: { padding: spacing.xl, paddingBottom: 48 },
  inner: { width: "100%", alignSelf: "center" },
  fill: { flex: 1, padding: spacing.lg },
});
