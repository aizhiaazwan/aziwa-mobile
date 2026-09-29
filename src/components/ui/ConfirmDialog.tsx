import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors, fonts, radius, shadow } from "@/constants/theme";
   import type { IconName } from "@/data/dummy";

type Props = {
  icon?: IconName;
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

   export function ConfirmDialog({
     visible,
     title,
     message,
     confirmLabel = "Hapus",
     icon = "trash-2",
     onConfirm,
     onCancel,
   }: Props) {
     const scale = useRef(new Animated.Value(0.92)).current;
     const fade = useRef(new Animated.Value(0)).current;

     useEffect(() => {
       if (!visible) return;
       scale.setValue(0.92);
       fade.setValue(0);
       Animated.parallel([
         Animated.timing(scale, {
           toValue: 1,
           duration: 220,
           easing: Easing.out(Easing.cubic),
           useNativeDriver: true,
         }),
         Animated.timing(fade, {
           toValue: 1,
           duration: 220,
           useNativeDriver: true,
         }),
       ]).start();
     }, [visible, scale, fade]);

     return (
       <Modal
         visible={visible}
         transparent
         animationType="fade"
         onRequestClose={onCancel}
         statusBarTranslucent
       >
         <View style={styles.backdrop}>
           <Animated.View
             style={[styles.card, { opacity: fade, transform: [{ scale }] }]}
           >
             <View style={styles.icon}>
               <Feather name={icon} size={24} color={colors.danger} />
             </View>
             <AppText variant="heading" style={{ textAlign: "center" }}>
               {title}
             </AppText>
             <AppText color={colors.textMuted} style={{ textAlign: "center" }}>
               {message}
             </AppText>
             <View style={styles.actions}>
               <Pressable
                 onPress={onCancel}
                 accessibilityRole="button"
                 style={[styles.btn, { backgroundColor: colors.primaryField }]}
               >
                 <AppText style={{ fontFamily: fonts.semibold, fontSize: 15 }}>
                   Batal
                 </AppText>
               </Pressable>
               <Pressable
                 onPress={onConfirm}
                 accessibilityRole="button"
                 style={[styles.btn, { backgroundColor: colors.danger }]}
               >
                 <AppText
                   style={{
                     fontFamily: fonts.semibold,
                     fontSize: 15,
                     color: "#fff",
                   }}
                 >
                   {confirmLabel}
                 </AppText>
               </Pressable>
             </View>
           </Animated.View>
         </View>
       </Modal>
     );
   }

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(27,27,58,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
    alignItems: "center",
    ...shadow.card,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 8, width: "100%" },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
