import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { colors, fonts, radius, shadow } from "@/constants/theme";

export function AppInput({
  error,
  multiline,
  style,
  ...rest
}: TextInputProps & { error?: boolean }) {
  return (
    <TextInput
      placeholderTextColor={colors.textPlaceholder}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      {...rest}
      style={[
        styles.input,
        multiline && { minHeight: 110 },
        error && styles.error,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: "transparent",
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    outlineStyle: "none",
    ...shadow.card,
  } as any,
  error: { borderColor: colors.danger },
});
