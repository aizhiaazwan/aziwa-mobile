import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppText } from "@/components/ui/AppText";
import { FadeInView } from "@/components/ui/FadeInView";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useProfile } from "@/contexts/ProfileContext";
import { useTasks } from "@/contexts/TasksContext";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import type { IconName } from "@/data/dummy";

const settings: { key: string; icon: IconName; title: string; sub: string }[] =
  [
    {
      key: "account",
      icon: "user",
      title: "Informasi Akun",
      sub: "Nama, email kampus, dan institusi",
    },
    {
      key: "reminder",
      icon: "bell",
      title: "Pengingat Cerdas",
      sub: "H-7, H-3, & H-1 sebelum deadline aktif",
    },
    {
      key: "calendar",
      icon: "calendar",
      title: "Sinkronisasi Kalender",
      sub: "Google Calendar & jadwal kuliah",
    },
    {
      key: "theme",
      icon: "sun",
      title: "Tema & Tampilan",
      sub: "Mode Terang • Aksen Lavender Ungu",
    },
    {
      key: "security",
      icon: "lock",
      title: "Keamanan & Kata Sandi",
      sub: "Autentikasi dua langkah & sandi",
    },
    {
      key: "help",
      icon: "help-circle",
      title: "Pusat Bantuan & Privasi",
      sub: "Panduan aplikasi dan data privasi",
    },
  ];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const { tasks } = useTasks();
  const [confirmOut, setConfirmOut] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const done = tasks.filter((t) => t.status === "completed").length;
  const running = tasks.filter((t) => t.status === "in_progress").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const onSetting = (key: string) => {
    if (key === "account") router.push("/edit-profile");
    else setToast("Fitur ini hadir di fase berikutnya");
  };

  return (
    <Screen
      header={<AppHeader title="Profil Pengguna" />}
      fab
      overlay={
        <>
          <Toast message={toast} onHide={() => setToast(null)} />
          <ConfirmDialog
            visible={confirmOut}
            icon="log-out"
            title="Keluar dari akun?"
            message="Kamu akan kembali ke halaman login."
            confirmLabel="Keluar"
            onCancel={() => setConfirmOut(false)}
            onConfirm={() => {
              setConfirmOut(false);
              router.replace("/login");
            }}
          />
        </>
      }
    >
      <View style={{ gap: 20 }}>
        {/* Kartu profil */}
        <FadeInView>
          <View style={styles.profileCard}>
            <View style={styles.semPill}>
              <View style={styles.semDot} />
              <AppText
                style={{
                  fontFamily: fonts.semibold,
                  fontSize: 12,
                  color: colors.primary,
                }}
              >
                Semester {profile.semester} • Aktif
              </AppText>
            </View>

            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Feather name="user" size={52} color={colors.primary} />
              </View>
              <Pressable
                onPress={() => router.push("/edit-profile")}
                accessibilityRole="button"
                accessibilityLabel="Edit profil"
                style={styles.pencil}
              >
                <Feather name="edit-2" size={16} color="#fff" />
              </Pressable>
            </View>

            <AppText style={styles.name}>{profile.name}</AppText>
            <AppText color={colors.textMuted} style={{ textAlign: "center" }}>
              Mahasiswa {profile.program} • Angkatan {profile.year}
            </AppText>

            <View style={styles.tagline}>
              <Ionicons name="sparkles" size={14} color="#8A5A00" />
              <AppText style={{ fontFamily: fonts.medium, fontSize: 13 }}>
                Plan. Do. Live.
              </AppText>
            </View>

            <Pressable
              onPress={() => router.push("/edit-profile")}
              accessibilityRole="button"
              style={styles.editBtn}
            >
              <Feather name="edit-2" size={16} color={colors.primary} />
              <AppText
                style={{
                  fontFamily: fonts.semibold,
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                Edit Profil
              </AppText>
            </Pressable>
          </View>
        </FadeInView>

        {/* Ringkasan akademik */}
        <FadeInView delay={80} style={{ gap: 12 }}>
          <View style={styles.between}>
            <AppText style={styles.section}>Ringkasan Akademik</AppText>
            <AppText style={styles.link}>Ganjil 2026/2027</AppText>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatCard
              icon={
                <Feather name="check-circle" size={22} color={colors.primary} />
              }
              value={done}
              label="Selesai"
            />
            <StatCard
              icon={
                <Ionicons
                  name="hourglass-outline"
                  size={22}
                  color={colors.primary}
                />
              }
              value={running}
              label="Berjalan"
            />
          </View>
        </FadeInView>

        {/* Insight */}
        <FadeInView delay={140}>
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <Feather name="award" size={22} color="#8A5A00" />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontFamily: fonts.bold, fontSize: 15 }}>
                Pertahankan Ritme Belajarmu!
              </AppText>
              <AppText
                variant="caption"
                style={{ fontSize: 13, lineHeight: 19 }}
              >
                {tasks.length
                  ? `${pct}% tugasmu sudah selesai. Terus semangat!`
                  : "Belum ada tugas. Tambahkan tugas pertamamu!"}
              </AppText>
            </View>
          </View>
        </FadeInView>

        {/* Pengaturan */}
        <FadeInView delay={200} style={{ gap: 12 }}>
          <AppText style={styles.section}>Pengaturan & Preferensi</AppText>
          <View style={styles.list}>
            {settings.map((s, i) => (
              <Pressable
                key={s.key}
                onPress={() => onSetting(s.key)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.row,
                  i > 0 && styles.rowBorder,
                  pressed && { backgroundColor: colors.primarySoft },
                ]}
              >
                <View style={styles.rowIcon}>
                  <Feather name={s.icon} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={{ fontFamily: fonts.semibold, fontSize: 15 }}>
                    {s.title}
                  </AppText>
                  <AppText variant="caption" numberOfLines={1}>
                    {s.sub}
                  </AppText>
                </View>
                <Feather name="chevron-right" size={20} color={colors.text} />
              </Pressable>
            ))}
          </View>
        </FadeInView>

        {/* Keluar */}
        <FadeInView delay={260} style={{ gap: 12 }}>
          <Pressable
            onPress={() => setConfirmOut(true)}
            accessibilityRole="button"
            style={styles.logout}
          >
            <Feather name="log-out" size={20} color={colors.danger} />
            <AppText
              style={{
                fontFamily: fonts.semibold,
                fontSize: 16,
                color: colors.danger,
              }}
            >
              Keluar dari Akun
            </AppText>
          </Pressable>
          <AppText variant="caption" style={{ textAlign: "center" }}>
            Aziwa Academic • Versi 1.0.0
          </AppText>
        </FadeInView>
      </View>
    </Screen>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statIcon}>{icon}</View>
      <AppText style={{ fontFamily: fonts.bold, fontSize: 28, lineHeight: 36 }}>
        {value}
      </AppText>
      <AppText
        style={{
          fontFamily: fonts.medium,
          fontSize: 14,
          color: colors.textMuted,
        }}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    gap: 8,
    padding: 20,
    paddingTop: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  semPill: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6E0FF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  semDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  avatarWrap: { marginTop: 4 },
  avatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  pencil: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    marginTop: 8,
    textAlign: "center",
  },
  tagline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryField,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 42,
    paddingHorizontal: 20,
    marginTop: 4,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primaryMuted,
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 26 },
  link: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 18,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  insight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryField,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    minHeight: 68,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
  },
});
