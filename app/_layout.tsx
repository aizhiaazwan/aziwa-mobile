import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { colors } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { DesktopShell } from "@/components/layout/DesktopShell";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { CoursesProvider } from "@/contexts/CoursesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import { AgendaProvider } from "@/contexts/AgendaContext";
import { TodosProvider } from "@/contexts/TodosContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { RemindersProvider } from "@/contexts/RemindersContext";
import { Stack, usePathname, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

export const unstable_settings = { initialRouteName: "index" };

SplashScreen.preventAutoHideAsync();

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot"];

// Jika belum/tidak lagi login, paksa ke halaman Login
function AuthGate() {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "signedOut" && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
    }
  }, [status, pathname, router]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  // Di desktop, layar tidak perlu meluncur dari bawah atau samping karena sidebar tetap di tempat
  const fromBottom = {
    animation: isDesktop ? "fade" : "slide_from_bottom",
  } as const;
  const fromRight = {
    animation: isDesktop ? "fade" : "slide_from_right",
  } as const;

    return (
      <ProfileProvider>
        <AuthProvider>
          <CoursesProvider>
            <TasksProvider>
              <AgendaProvider>
                <TodosProvider>
                  <NotesProvider>
                    <RemindersProvider>
                      <StatusBar style="dark" />
                      <DesktopShell>
                        <Stack
                          screenOptions={{
                            headerShown: false,
                            animation: "fade",
                            contentStyle: {
                              backgroundColor: colors.background,
                            },
                          }}
                        >
                          <Stack.Screen name="add-task" options={fromBottom} />
                          <Stack.Screen
                            name="add-course"
                            options={fromBottom}
                          />
                          <Stack.Screen
                            name="edit-profile"
                            options={fromBottom}
                          />
                          <Stack.Screen
                            name="add-agenda"
                            options={fromBottom}
                          />
                          <Stack.Screen name="add-todo" options={fromBottom} />
                          <Stack.Screen name="add-note" options={fromBottom} />
                          <Stack.Screen
                            name="add-reminder"
                            options={fromBottom}
                          />
                          <Stack.Screen name="agenda" options={fromRight} />
                          <Stack.Screen name="todos" options={fromRight} />
                          <Stack.Screen name="notes" options={fromRight} />
                          <Stack.Screen name="reminders" options={fromRight} />
                        </Stack>
                        <AuthGate />
                      </DesktopShell>
                    </RemindersProvider>
                  </NotesProvider>
                </TodosProvider>
              </AgendaProvider>
            </TasksProvider>
          </CoursesProvider>
        </AuthProvider>
      </ProfileProvider>
    );
}
