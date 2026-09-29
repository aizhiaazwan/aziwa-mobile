import { Image, View } from "react-native";
import { shadow } from "@/constants/theme";

export function AziwaLogo({ size = 92 }: { size?: number }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.3,
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
        },
        shadow.card,
      ]}
    >
      <Image
        source={require("../../../assets/images/aziwa-image.jpeg")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}
