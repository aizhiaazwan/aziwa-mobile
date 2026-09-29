import { ReactNode, useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { AppText } from "./AppText";
import { colors, fonts } from "@/constants/theme";

type Props = {
  label: string;
  required?: boolean;
  right?: string;
  error?: string;
  shakeKey?: number; // naik 1 setiap submit gagal
  children: ReactNode;
};

export function FormField({
  label,
  required,
  right,
  error,
  shakeKey = 0,
  children,
}: Props) {
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!error || shakeKey === 0) return;
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shakeKey]);

  return (
    <Animated.View style={{ gap: 8, transform: [{ translateX: shake }] }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>
          {label}
          {required ? (
            <AppText style={{ color: colors.danger }}> *</AppText>
          ) : null}
        </AppText>
        {right ? <AppText variant="caption">{right}</AppText> : null}
      </View>
      {children}
      {error ? (
        <AppText
          style={{
            fontFamily: fonts.medium,
            fontSize: 13,
            color: colors.danger,
          }}
        >
          {error}
        </AppText>
      ) : null}
    </Animated.View>
  );
}
