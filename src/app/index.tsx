import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { api } from "../api/client";

export default function Index() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/ping")
      .then((res) => {
        setMessage(res.data.message);
        setStatus("ok");
      })
      .catch((e) => {
        setMessage(e.message);
        setStatus("error");
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "700", color: "#7C5CFF" }}>
        Aziwa
      </Text>
      <Text>Plan. Do. Live.</Text>
      {status === "loading" && <ActivityIndicator color="#7C5CFF" />}
      {status === "ok" && <Text>✅ {message}</Text>}
      {status === "error" && <Text>❌ Gagal terhubung: {message}</Text>}
    </View>
  );
}
