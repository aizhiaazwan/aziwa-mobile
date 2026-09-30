import { Children, isValidElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// Mobile: satu kolom. Desktop: dua kolom.
export function CardGrid({ children }: { children: ReactNode }) {
  const { isDesktop } = useBreakpoint();
  if (!isDesktop) return <View style={styles.column}>{children}</View>;

  const items = Children.toArray(children);
  return (
    <View style={styles.grid}>
      {items.map((c, i) => (
        // key asli dipertahankan supaya animasi tiap kartu tidak tertukar
        <View key={isValidElement(c) && c.key != null ? c.key : i} style={styles.cell}>
          {c}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { gap: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  cell: { width: '48.5%' },
});