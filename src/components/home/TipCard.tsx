import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";

export function TipCard({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        <Feather name="clock" size={30} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText
          style={{
            fontFamily: fonts.medium,
            fontSize: 13,
            color: colors.primary,
          }}
        >
          Tips Hari Ini
        </AppText>
        <AppText
          style={{ fontFamily: fonts.bold, fontSize: 17, lineHeight: 24 }}
        >
          {title}
        </AppText>
        <AppText variant="caption" numberOfLines={2}>
          {text}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 14,
    ...shadow.card,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
