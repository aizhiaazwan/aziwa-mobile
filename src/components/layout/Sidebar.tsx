import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { AziwaLogo } from "@/components/ui/AziwaLogo";
import { SheetMenu } from "@/components/ui/SheetMenu";
import { useProfile } from "@/contexts/ProfileContext";
import { addItems } from "@/constants/addMenu";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import type { IconName } from "@/data/dummy";

type Item = { label: string; icon: IconName; route: string; also: string[] };

// "also" = halaman form yang tetap menandai menu ini sebagai aktif
const items: Item[] = [
  { label: "Dashboard", icon: "grid", route: "/home", also: [] },
  {
    label: "Tugas",
    icon: "check-circle",
    route: "/tasks",
    also: ["/add-task"],
  },
  {
    label: "Mata Kuliah",
    icon: "book-open",
    route: "/courses",
    also: ["/add-course"],
  },
  {
    label: "Agenda",
    icon: "calendar",
    route: "/agenda",
    also: ["/add-agenda"],
  },
  {
    label: "To-Do",
    icon: "check-square",
    route: "/todos",
    also: ["/add-todo"],
  },
  { label: "Catatan", icon: "file-text", route: "/notes", also: ["/add-note"] },
  {
    label: "Pengingat",
    icon: "bell",
    route: "/reminders",
    also: ["/add-reminder"],
  },
  { label: "Profil", icon: "user", route: "/profile", also: ["/edit-profile"] },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useProfile();
  const [addMenu, setAddMenu] = useState(false);

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <AziwaLogo size={44} />
        <View>
          <AppText
            style={{
              fontFamily: fonts.extrabold,
              fontSize: 24,
              lineHeight: 30,
            }}
          >
            aziwa
          </AppText>
          <AppText
            style={{
              fontFamily: fonts.semibold,
              fontSize: 10,
              letterSpacing: 1.5,
              color: colors.primary,
            }}
          >
            PLAN. DO. LIVE.
          </AppText>
        </View>
      </View>

      <Pressable
        onPress={() => setAddMenu(true)}
        accessibilityRole="button"
        style={styles.addBtn}
      >
        <Feather name="plus" size={20} color="#fff" />
        <AppText
          style={{ fontFamily: fonts.semibold, fontSize: 15, color: "#fff" }}
        >
          Tambah Baru
        </AppText>
      </Pressable>

      <View style={styles.nav}>
        {items.map((it) => {
          const active = pathname === it.route || it.also.includes(pathname);
          return (
            <Pressable
              key={it.route}
              onPress={() => router.replace(it.route as any)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={(state: any) => [
                styles.item,
                active && styles.itemActive,
                !active &&
                  state.hovered && { backgroundColor: colors.primaryField },
                state.pressed && { opacity: 0.85 },
              ]}
            >
              <View style={[styles.indicator, { opacity: active ? 1 : 0 }]} />
              <Feather
                name={it.icon}
                size={20}
                color={active ? colors.primary : colors.textMuted}
              />
              <AppText
                style={{
                  fontFamily: active ? fonts.semibold : fonts.medium,
                  fontSize: 15,
                  color: active ? colors.primary : colors.text,
                }}
              >
                {it.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      <Pressable
        onPress={() => router.replace("/profile")}
        accessibilityRole="button"
        style={styles.user}
      >
        <View style={styles.avatar}>
          <AppText
            style={{
              fontFamily: fonts.bold,
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText
            numberOfLines={1}
            style={{ fontFamily: fonts.semibold, fontSize: 14 }}
          >
            {profile.name}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            Semester {profile.semester}
          </AppText>
        </View>
      </Pressable>

      <SheetMenu
        visible={addMenu}
        title="Tambah Baru"
        items={addItems}
        onClose={() => setAddMenu(false)}
        onSelect={(route) => {
          setAddMenu(false);
          router.push(route as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: 264,
    padding: 20,
    gap: 20,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  addBtn: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    ...shadow.primary,
  },
  nav: { gap: 4 },
  item: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  itemActive: { backgroundColor: colors.primarySoft },
  indicator: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryField,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6E0FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
