import { ReactNode, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing } from "@/constants/theme";
import { FadeInView } from "./FadeInView";
import { Fab } from "./Fab";
import { SheetMenu, SheetItem } from "./SheetMenu";

// key = alamat route tujuan
const addItems: SheetItem[] = [
  { key: "/add-task", label: "Tugas Kuliah", icon: "check-circle" },
  { key: "/add-agenda", label: "Agenda", icon: "calendar" },
  { key: "/add-todo", label: "To-Do", icon: "list" },
];

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
  const [addMenu, setAddMenu] = useState(false);

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
      {fab && <Fab onPress={onFabPress ?? (() => setAddMenu(true))} />}
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
  inner: { width: "100%", maxWidth: 720, alignSelf: "center" },
  fill: { flex: 1, padding: spacing.lg },
});
