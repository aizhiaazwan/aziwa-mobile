import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { Note, tagMeta } from "@/contexts/NotesContext";
import { formatKeyShort } from "@/utils/date";

type Props = {
  note: Note;
  removing?: boolean;
  onPress: (id: number) => void;
  onMore: (id: number) => void;
  onRemoved: (id: number) => void;
};

export function NoteCard({
  note,
  removing,
  onPress,
  onMore,
  onRemoved,
}: Props) {
  const meta = tagMeta[note.tag];
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!removing) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -40,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onRemoved(note.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removing]);

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateX }] }]}
    >
      <Pressable
        onPress={() => onPress(note.id)}
        accessibilityRole="button"
        style={({ pressed }) => [styles.inner, pressed && { opacity: 0.85 }]}
      >
        <View style={styles.top}>
          <View style={[styles.pill, { backgroundColor: meta.bg }]}>
            <AppText
              style={{
                fontFamily: fonts.semibold,
                fontSize: 12,
                lineHeight: 16,
                color: meta.fg,
              }}
            >
              {meta.label}
            </AppText>
          </View>
          <View style={{ flex: 1 }} />
          <AppText variant="caption">{formatKeyShort(note.date)}</AppText>
          <Pressable
            onPress={() => onMore(note.id)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Menu catatan"
            style={{ padding: 4 }}
          >
            <Feather name="more-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>
        <AppText
          style={{ fontFamily: fonts.bold, fontSize: 17, lineHeight: 24 }}
        >
          {note.title}
        </AppText>
        {note.content ? (
          <AppText
            color={colors.textMuted}
            numberOfLines={2}
            style={{ fontSize: 14, lineHeight: 21 }}
          >
            {note.content}
          </AppText>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  inner: { padding: 16, gap: 8 },
  top: { flexDirection: "row", alignItems: "center", gap: 8 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
});

