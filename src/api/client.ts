import axios, { AxiosError } from "axios";
import { getToken } from "@/utils/storage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { Accept: "application/json" },
});

// Setiap request membawa token jika ada
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AuthContext mendaftarkan fungsi ini: dipanggil saat token ditolak server
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    const isAuthCall = url.includes("/login") || url.includes("/register");
    // 401 di login berarti sandi salah, bukan token kedaluwarsa
    if (error.response?.status === 401 && !isAuthCall) onUnauthorized?.();
    return Promise.reject(error);
  },
);
