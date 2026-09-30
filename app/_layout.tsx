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
import { NotesProvider } from '@/contexts/NotesContext';
import { RemindersProvider } from '@/contexts/RemindersContext';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = { initialRouteName: "index" };
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
                      <NotesProvider>
                        <RemindersProvider>
                          <StatusBar style="dark" />
                          <Stack
                            screenOptions={{
                              headerShown: false,
                              animation: "fade",
                              contentStyle: {
                                backgroundColor: colors.background,
                              },
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
                              name="add-note"
                              options={{ animation: "slide_from_bottom" }}
                            />
                            <Stack.Screen
                              name="add-reminder"
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
                            <Stack.Screen
                              name="notes"
                              options={{ animation: "slide_from_right" }}
                            />
                            <Stack.Screen
                              name="reminders"
                              options={{ animation: "slide_from_right" }}
                            />
                          </Stack>
                        </RemindersProvider>
                      </NotesProvider>
                    </TodosProvider>
                  </AgendaProvider>
                </TasksProvider>
              </CoursesProvider>
            </ProfileProvider>
          );
}
