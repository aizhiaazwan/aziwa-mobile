import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "aziwa_token";

// Android: SecureStore (terenkripsi). Web: localStorage.
export async function getToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem(KEY)
        : null;
    }
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.setItem(KEY, token);
      return;
    }
    await SecureStore.setItemAsync(KEY, token);
  } catch {
    // gagal menyimpan: pengguna perlu login lagi di sesi berikutnya
  }
}

export async function clearToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
      return;
    }
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // diabaikan
  }
}

