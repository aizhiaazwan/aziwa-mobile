export const colors = {
  primary: "#5B3DE0",
  primarySoft: "#EFEBFF",
  primaryField: "#F3F1FF",
  primaryMuted: "#B49BFF",

  background: "#FAF9FF",
  surface: "#FFFFFF",
  border: "#ECE9F7",

  text: "#1B1B3A",
  textMuted: "#6B6B85",
  textPlaceholder: "#B4B2C9",
  textOnPrimary: "#FFFFFF",

  accent: "#FFC857",
  accentSoft: "#FFF3D6",

  danger: "#C62828",
  dangerSoft: "#FDE8E8",
  success: "#1FA971",
  successSoft: "#E3F6EE",
  warning: "#B7791F",
  warningSoft: "#FFF3D6",
} as const;

export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

// Bayangan lembut, sengaja tipis agar tidak ramai
export const shadow = {
  card: {
    shadowColor: "#3B2A8F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  primary: {
    shadowColor: "#5B3DE0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
