import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { TasksProvider } from "@/contexts/TasksContext";
import { CoursesProvider } from "@/contexts/CoursesContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { colors } from "@/constants/theme";
import { AgendaProvider } from "@/contexts/AgendaContext";
import { TodosProvider } from "@/contexts/TodosContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

        return (
          <ProfileProvider>
            <CoursesProvider>
              <TasksProvider>
                <AgendaProvider>
                  <TodosProvider>
                    <StatusBar style="dark" />
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: "fade",
                        contentStyle: { backgroundColor: colors.background },
                      }}
                    >
                      <Stack.Screen
                        name="add-task"
                        options={{ animation: "slide_from_bottom" }}
                      />
                      <Stack.Screen
                        name="add-course"
                        options={{ animation: "slide_from_bottom" }}
                      />
                      <Stack.Screen
                        name="edit-profile"
                        options={{ animation: "slide_from_bottom" }}
                      />
                      <Stack.Screen
                        name="add-agenda"
                        options={{ animation: "slide_from_bottom" }}
                      />
                      <Stack.Screen
                        name="add-todo"
                        options={{ animation: "slide_from_bottom" }}
                      />
                      <Stack.Screen
                        name="agenda"
                        options={{ animation: "slide_from_right" }}
                      />
                      <Stack.Screen
                        name="todos"
                        options={{ animation: "slide_from_right" }}
                      />
                    </Stack>
                  </TodosProvider>
                </AgendaProvider>
              </TasksProvider>
            </CoursesProvider>
          </ProfileProvider>
        );
}
