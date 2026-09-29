// Warna diambil dari screenshot Stitch. Jika ada yang kurang pas,
// cukup ubah di sini dan seluruh aplikasi ikut berubah.
export const colors = {
  primary: "#5B3DE0",
  primarySoft: "#EFEBFF",
  primaryMuted: "#B49BFF",

  background: "#FAF9FF",
  surface: "#FFFFFF",
  border: "#ECE9F7",

  text: "#1B1B3A",
  textMuted: "#6B6B85",
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
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
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
  pill: 999,
} as const;
