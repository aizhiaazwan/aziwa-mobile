import { useRouter } from "expo-router";

// Kembali ke layar sebelumnya. Jika tidak ada riwayat
// (misalnya setelah reload), pindah ke Home.
export function useGoBack() {
  const router = useRouter();
  return () => (router.canGoBack() ? router.back() : router.replace("/home"));
}
