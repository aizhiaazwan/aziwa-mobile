import { useWindowDimensions } from "react-native";

export const DESKTOP_MIN = 1024;

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_MIN;
  return { width, isDesktop, contentMax: isDesktop ? 1080 : 720 };
}
