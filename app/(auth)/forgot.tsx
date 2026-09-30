import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { colors, fonts, radius, shadow } from "@/constants/theme";

export default function ForgotScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Tampilan saja. Pengiriman email reset dikerjakan di Phase 3.
  const handleSend = () => {
    if (loading) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Format email tidak valid.");
      return;
    }
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <Screen>
      <Pressable
        onPress={() => router.back()}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Kembali"
        style={styles.back}
      >
        <Feather name="arrow-left" size={24} color={colors.text} />
      </Pressable>

      <FadeInView delay={60} style={styles.card}>
        <View style={styles.icon}>
          <Feather
            name={sent ? "check-circle" : "key"}
            size={28}
            color={colors.primary}
          />
        </View>
        {sent ? (
          <>
            <AppText variant="title" style={{ fontSize: 24, lineHeight: 32 }}>
              Cek email kamu
            </AppText>
            <AppText color={colors.textMuted}>
              Jika {email.trim()} terdaftar, tautan untuk mengatur ulang kata
              sandi akan dikirim.
            </AppText>
            <Button
              label="Kembali ke Login"
              onPress={() => router.replace("/login")}
            />
          </>
        ) : (
          <>
            <AppText variant="title" style={{ fontSize: 24, lineHeight: 32 }}>
              Lupa Kata Sandi?
            </AppText>
            <AppText color={colors.textMuted}>
              Masukkan email kampusmu, kami kirim tautan untuk mengatur ulang.
            </AppText>
            <TextField
              label="Email Kampus / Mahasiswa"
              icon="at-sign"
              placeholder="contoh@mahasiswa.ac.id"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              error={error}
            />
            <Button
              label="Kirim Tautan Reset"
              loading={loading}
              onPress={handleSend}
            />
          </>
        )}
      </FadeInView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 24,
    gap: 18,
    ...shadow.card,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
