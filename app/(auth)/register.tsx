import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { AppText } from "@/components/ui/AppText";
import { AziwaLogo } from "@/components/ui/AziwaLogo";
import { FadeInView } from "@/components/ui/FadeInView";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useProfile } from "@/contexts/ProfileContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";

type Errors = Partial<
  Record<"name" | "email" | "password" | "confirm", string>
>;

export default function RegisterScreen() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Nama lengkap wajib diisi.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      e.email = "Format email tidak valid.";
    if (password.length < 8) e.password = "Kata sandi minimal 8 karakter.";
    if (confirm !== password) e.confirm = "Konfirmasi kata sandi tidak sama.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Sementara: langsung masuk. Di Phase 4 diganti POST /api/register.
  const handleRegister = () => {
    if (loading || !validate()) return;
    setLoading(true);
    setTimeout(() => {
      updateProfile({ name: name.trim(), email: email.trim() });
      setLoading(false);
      router.replace("/home");
    }, 700);
  };

  return (
    <Screen>
      <View style={styles.brand}>
        <AziwaLogo size={72} />
        <AppText style={styles.tagline}>PLAN. DO. LIVE.</AppText>
      </View>

      <FadeInView delay={100} style={styles.card}>
        <View style={{ gap: 6 }}>
          <AppText variant="title" style={{ fontSize: 24, lineHeight: 32 }}>
            Buat Akun Aziwa ✨
          </AppText>
          <AppText color={colors.textMuted}>
            Daftar untuk mulai mengatur tugas dan jadwal kuliahmu.
          </AppText>
        </View>

        <TextField
          label="Nama Lengkap"
          icon="user"
          placeholder="Nama lengkap"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <TextField
          label="Email Kampus / Mahasiswa"
          icon="at-sign"
          placeholder="contoh@mahasiswa.ac.id"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <TextField
          label="Kata Sandi"
          icon="lock"
          password
          placeholder="Minimal 8 karakter"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <TextField
          label="Konfirmasi Kata Sandi"
          icon="lock"
          password
          placeholder="Ulangi kata sandi"
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
        />

        <Button
          label="Daftar Sekarang"
          loading={loading}
          onPress={handleRegister}
          iconRight={<Feather name="arrow-right" size={20} color="#fff" />}
        />
      </FadeInView>

      <FadeInView delay={250} style={{ alignItems: "center", marginTop: 24 }}>
        <Pressable
          onPress={() => router.replace("/login")}
          accessibilityRole="button"
        >
          <AppText color={colors.textMuted}>
            Sudah punya akun?{" "}
            <AppText
              style={{ fontFamily: fonts.semibold, color: colors.primary }}
            >
              Masuk
            </AppText>
          </AppText>
        </Pressable>
      </FadeInView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: "center", gap: 10, marginTop: 8, marginBottom: 20 },
  tagline: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 2,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 24,
    gap: 18,
    ...shadow.card,
  },
});
