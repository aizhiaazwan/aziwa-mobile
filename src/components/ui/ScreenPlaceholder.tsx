import { AppText } from "./AppText";
import { AppHeader } from "./AppHeader";
import { Screen } from "./Screen";
import { colors } from "@/constants/theme";

export function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <Screen header={<AppHeader title={title} />} fab>
      <AppText variant="heading">{title}</AppText>
      <AppText color={colors.textMuted}>
        Layar ini akan diisi di sub-fase berikutnya.
      </AppText>
    </Screen>
  );
}
