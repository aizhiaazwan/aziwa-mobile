import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";

export function GreetingCard({
  name,
  semester,
}: {
  name: string;
  semester: string;
}) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1, gap: 6 }}>
        <View style={styles.row}>
          <Feather name="sun" size={16} color={colors.primary} />
          <AppText
            style={{
              fontFamily: fonts.medium,
              fontSize: 14,
              color: colors.primary,
            }}
          >
            {semester}
          </AppText>
        </View>
        <AppText style={styles.hello}>Hai, {name} 👋</AppText>
        <AppText
          color={colors.textMuted}
          style={{ fontSize: 16, lineHeight: 24 }}
        >
          Berikut ringkasan aktivitas akademikmu hari ini.
        </AppText>
      </View>
      <View style={styles.flame}>
        <Feather name="droplet" size={26} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow.card,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  hello: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.text,
  },
  flame: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: "#E2DBFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
