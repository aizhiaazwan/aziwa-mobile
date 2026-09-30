import { ReactNode } from "react";
import { View } from "react-native";
import { usePathname } from "expo-router";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/constants/theme";
import { Sidebar } from "./Sidebar";

const NO_SIDEBAR = ["/", "/login", "/register", "/forgot"];

export function DesktopShell({ children }: { children: ReactNode }) {
  const { isDesktop } = useBreakpoint();
  const pathname = usePathname();
  const showSidebar = isDesktop && !NO_SIDEBAR.includes(pathname);

  // Struktur selalu sama agar navigator tidak dibuat ulang saat sidebar muncul/hilang
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: colors.background,
      }}
    >
      {showSidebar && <Sidebar />}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
