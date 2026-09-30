import { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { AppText } from "@/components/ui/AppText";
import { AziwaLogo } from "@/components/ui/AziwaLogo";
import { FadeInView } from "@/components/ui/FadeInView";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/constants/theme";

export default function Splash() {
  const router = useRouter();
  const { status } = useAuth();
  const [minDone, setMinDone] = useState(false);

  // Logo tampil minimal 1,4 detik agar animasinya terlihat
  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // Sudah login -> Home. Belum -> Login.
  useEffect(() => {
    if (!minDone || status === "loading") return;
    router.replace(status === "signedIn" ? "/home" : "/login");
  }, [minDone, status, router]);

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
