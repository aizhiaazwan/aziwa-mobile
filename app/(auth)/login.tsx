import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { AppText } from "@/components/ui/AppText";
import { AziwaLogo } from "@/components/ui/AziwaLogo";
import { FadeInView } from "@/components/ui/FadeInView";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { colors, fonts, radius, shadow } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Sementara: langsung masuk. Di Phase 4 diganti panggilan API login.
  const handleLogin = () => router.replace("/home");

  return (
    <Screen>
      <View style={styles.brand}>
        <AziwaLogo size={92} />
        <View style={styles.wordmarkRow}>
          <AppText style={styles.wordmark}>aziwa</AppText>
          <View style={styles.dot} />
        </View>
        <AppText style={styles.tagline}>PLAN. DO. LIVE.</AppText>
      </View>

      <FadeInView delay={150} style={styles.card}>
        <View style={{ gap: 6 }}>
          <AppText variant="title" style={{ fontSize: 24, lineHeight: 32 }}>
            Selamat Datang Kembali 👋
          </AppText>
          <AppText color={colors.textMuted}>
            Masuk untuk mengelola jadwal kuliah dan tugasmu dengan teratur.
          </AppText>
        </View>

        <TextField
          label="Email Kampus / Mahasiswa"
          icon="at-sign"
          placeholder="contoh@mahasiswa.ac.id"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Kata Sandi"
          icon="lock"
          password
          placeholder="••••••••••••"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.rowBetween}>
          <Pressable
            style={styles.remember}
            onPress={() => setRemember((r) => !r)}
          >
            <View style={[styles.checkbox, remember && styles.checkboxOn]}>
              {remember && <Feather name="check" size={14} color="#fff" />}
            </View>
            <AppText color={colors.textMuted}>Ingat saya</AppText>
          </Pressable>
          <Pressable onPress={() => router.push("/forgot")}>
            <AppText style={styles.link}>Lupa Kata Sandi?</AppText>
          </Pressable>
        </View>

        <Button
          label="Masuk ke Aziwa"
          onPress={handleLogin}
          iconRight={<Feather name="arrow-right" size={20} color="#fff" />}
        />

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <AppText color={colors.textMuted}>atau masuk dengan</AppText>
          <View style={styles.line} />
        </View>

        {/* Tampilan saja. Login Google tidak ada di rencana backend (Sanctum). */}
        <Button
          variant="soft"
          label="Google Mahasiswa"
          iconLeft={<AntDesign name="google" size={20} color="#4285F4" />}
        />
      </FadeInView>

      <FadeInView delay={300} style={styles.footer}>
        <AppText color={colors.textMuted}>
          Belum punya akun?{" "}
            <AppText style={styles.link} onPress={() => router.push('/register')}>Daftar Sekarang</AppText>
        </AppText>
        <View style={styles.secure}>
          <Feather name="shield" size={16} color={colors.primary} />
          <AppText variant="caption" color={colors.text}>
            Dilindungi enkripsi sistem akademik Aziwa
          </AppText>
        </View>
      </FadeInView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: "center", gap: 8, marginTop: 8, marginBottom: 24 },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginTop: 8,
  },
  wordmark: {
    fontFamily: fonts.extrabold,
    fontSize: 36,
    lineHeight: 42,
    color: colors.text,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginBottom: 12,
  },
  tagline: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 24,
    gap: 20,
    ...shadow.card,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remember: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  link: { fontFamily: fonts.semibold, color: colors.primary },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  footer: { alignItems: "center", gap: 14, marginTop: 24 },
  secure: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
});
