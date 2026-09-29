import { View } from "react-native";
import { AppText } from "./AppText";
import { Screen } from "./Screen";
import { colors } from "@/constants/theme";

export function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <Screen>
      <AppText variant="caption" color={colors.primary}>
        Aziwa Academic
      </AppText>
      <AppText variant="title">{title}</AppText>
      <View style={{ height: 8 }} />
      <AppText variant="body" color={colors.textMuted}>
        Layar ini akan diisi di sub-fase berikutnya.
      </AppText>
    </Screen>
  );
}
