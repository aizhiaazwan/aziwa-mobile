import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors, fonts, radius } from '@/constants/theme';

type Props = TextInputProps & {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  password?: boolean;
};

export function TextField({ label, icon, password, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!password);

  return (
    <View style={{ gap: 8 }}>
      <AppText variant="subheading" style={{ fontSize: 14, lineHeight: 20 }}>
        {label}
      </AppText>
      <View style={[styles.field, focused && styles.focused]}>
        <Feather name={icon} size={20} color={colors.textMuted} />
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={colors.textPlaceholder}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {password && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel="Tampilkan sandi">
            <Feather name={hidden ? 'eye' : 'eye-off'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryField,
    borderWidth: 1.5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  focused: { borderColor: colors.primary, backgroundColor: colors.surface },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    height: '100%',
    // menghilangkan outline bawaan browser di web
    outlineStyle: 'none',
  } as any,
});