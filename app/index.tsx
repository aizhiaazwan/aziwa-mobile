import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { AppText } from "@/components/ui/AppText";
import { AziwaLogo } from "@/components/ui/AziwaLogo";
import { FadeInView } from "@/components/ui/FadeInView";
import { colors } from "@/constants/theme";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    // Nanti diganti: cek token tersimpan -> Home, jika tidak -> Login
    const timer = setTimeout(() => router.replace("/login"), 1600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <FadeInView style={{ alignItems: "center", gap: 16 }}>
        <AziwaLogo size={120} />
        <AppText
          variant="caption"
          color={colors.primary}
          style={{ letterSpacing: 2 }}
        >
          PLAN. DO. LIVE.
        </AppText>
      </FadeInView>
    </View>
  );
}
