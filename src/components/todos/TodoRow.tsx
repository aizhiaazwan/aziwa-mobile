import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { priorityLabel, priorityTone } from '@/constants/labels';
import { formatKeyShort } from '@/utils/date';
import type { Todo } from '@/contexts/TodosContext';

type Props = {
  todo: Todo;
  todayKey: string;
  removing?: boolean;
  onToggle: (id: number) => void;
  onPress: (id: number) => void;
  onMore: (id: number) => void;
  onRemoved: (id: number) => void;
};

export function TodoRow({ todo, todayKey, removing, onToggle, onPress, onMore, onRemoved }: Props) {
  const done = todo.status === 'completed';
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!removing) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -40, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start(() => onRemoved(todo.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removing]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(pop, { toValue: 1.25, duration: 110, useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }),
    ]).start();
    onToggle(todo.id);
  };

  const overdue = !!todo.deadline && !done && todo.deadline < todayKey;
  const isToday = todo.deadline === todayKey;
  const dueColor = done ? colors.textMuted : overdue ? colors.danger : isToday ? '#8A5A00' : colors.textMuted;
  const dueText = todo.deadline ? (isToday ? 'Hari ini' : formatKeyShort(todo.deadline)) : '';

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateX }] }]}>
      <Animated.View style={{ transform: [{ scale: pop }] }}>
        <Pressable
          onPress={handleToggle}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={`Tandai ${todo.title}`}
          style={[styles.checkbox, done && { backgroundColor: colors.primary }]}
        >
          {done && <Feather name="check" size={18} color="#fff" />}
        </Pressable>
      </Animated.View>

      <Pressable onPress={() => onPress(todo.id)} accessibilityRole="button" style={{ flex: 1, gap: 6 }}>
        <AppText
          style={{
            fontFamily: fonts.semibold,
            fontSize: 16,
            lineHeight: 22,
            color: done ? colors.textMuted : colors.text,
            textDecorationLine: done ? 'line-through' : 'none',
          }}
        >
          {todo.title}
        </AppText>
        <View style={styles.meta}>
          {!done && <Badge label={priorityLabel[todo.priority]} tone={priorityTone[todo.priority]} />}
          {todo.status === 'in_progress' && <Badge label="In Progress" tone="primary" />}
          {dueText ? (
            <View style={styles.due}>
              <Feather name="calendar" size={14} color={dueColor} />
              <AppText style={{ fontSize: 13, color: dueColor }}>{overdue ? `Terlewat • ${dueText}` : dueText}</AppText>
            </View>
          ) : null}
        </View>
      </Pressable>

      <Pressable onPress={() => onMore(todo.id)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Menu to-do" style={{ padding: 4 }}>
        <Feather name="more-vertical" size={20} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card },
  checkbox: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  due: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});