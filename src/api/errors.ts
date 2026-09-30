import type { AxiosError } from "axios";

export type ApiError = { message: string; fields: Record<string, string> };

// Mengubah error axios menjadi pesan untuk pengguna + pesan per kolom
export function parseError(e: unknown): ApiError {
  const err = e as AxiosError<any>;

  if (err?.response) {
    const d = err.response.data;
    const fields: Record<string, string> = {};
    if (d?.errors && typeof d.errors === "object") {
      for (const k of Object.keys(d.errors)) {
        const v = d.errors[k];
        fields[k] = Array.isArray(v) ? String(v[0]) : String(v);
      }
    }
    return { message: d?.message ?? "Terjadi kesalahan. Coba lagi.", fields };
  }

  if (err?.code === "ECONNABORTED") {
    return { message: "Koneksi terlalu lama. Coba lagi.", fields: {} };
  }
  return {
    message: "Tidak dapat terhubung ke server. Periksa koneksi dan alamat API.",
    fields: {},
  };
}
