import { Text, TextProps, StyleSheet } from "react-native";
import { colors, fonts } from "@/constants/theme";

type Variant =
  | "title"
  | "heading"
  | "subheading"
  | "body"
  | "caption"
  | "label";

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

export function AppText({ variant = "body", color, style, ...rest }: Props) {
  return (
    <Text
      style={[styles[variant], color ? { color } : null, style]}
      {...rest}
    />
  );
}

// Catatan: jangan pakai fontWeight, gunakan fontFamily
// agar tampil sama di Android dan web.
const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.text,
  },
  heading: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  subheading: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
