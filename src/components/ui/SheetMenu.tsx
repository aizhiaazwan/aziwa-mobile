import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors, fonts, radius } from "@/constants/theme";
import type { IconName } from "@/data/dummy";

export type SheetItem = {
  key: string;
  label: string;
  icon?: IconName;
  danger?: boolean;
  selected?: boolean;
  section?: string; // judul kelompok, tampil saat berbeda dari item sebelumnya
};

type Props = {
  visible: boolean;
  title?: string;
  items: SheetItem[];
  onSelect: (key: string) => void;
  onClose: () => void;
};

export function SheetMenu({ visible, title, items, onSelect, onClose }: Props) {
  const slide = useRef(new Animated.Value(40)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    slide.setValue(40);
    fade.setValue(0);
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, slide, fade]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <Pressable onPress={() => {}}>
            <View style={styles.handle} />
            {title ? (
              <AppText variant="heading" style={{ marginBottom: 8 }}>
                {title}
              </AppText>
            ) : null}
            <ScrollView
              style={{ maxHeight: 420 }}
              showsVerticalScrollIndicator={false}
            >
              {items.map((it, i) => (
                <View key={it.key}>
                  {it.section && it.section !== items[i - 1]?.section ? (
                    <AppText style={styles.section}>{it.section}</AppText>
                  ) : null}
                  <Pressable
                    onPress={() => onSelect(it.key)}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.row,
                      pressed && { backgroundColor: colors.primarySoft },
                    ]}
                  >
                    {it.icon ? (
                      <View
                        style={[
                          styles.iconBox,
                          it.danger && { backgroundColor: colors.dangerSoft },
                        ]}
                      >
                        <Feather
                          name={it.icon}
                          size={18}
                          color={it.danger ? colors.danger : colors.primary}
                        />
                      </View>
                    ) : null}
                    <AppText
                      style={{
                        flex: 1,
                        fontFamily: it.selected ? fonts.semibold : fonts.medium,
                        fontSize: 15,
                        color: it.danger ? colors.danger : colors.text,
                      }}
                    >
                      {it.label}
                    </AppText>
                    {it.selected ? (
                      <Feather name="check" size={20} color={colors.primary} />
                    ) : null}
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
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
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  section: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 8,
    borderRadius: radius.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
