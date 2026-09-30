import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiUser, fetchMe, login, logout, register } from "@/api/auth";
import { setUnauthorizedHandler } from "@/api/client";
import { useProfile } from "@/contexts/ProfileContext";
import { clearToken, getToken, setToken } from "@/utils/storage";

type Status = "loading" | "signedIn" | "signedOut";

type Value = {
  status: Status;
  user: ApiUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (p: {
    name: string;
    email: string;
    password: string;
    confirm: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Value | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { updateProfile } = useProfile();
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<ApiUser | null>(null);

  // Salin data dari API ke ProfileContext (hanya nilai yang terisi)
  const applyUser = useCallback(
    (u: ApiUser) => {
      setUser(u);
      updateProfile({
        name: u.name,
        email: u.email,
        ...(u.university ? { university: u.university } : {}),
        ...(u.program ? { program: u.program } : {}),
        ...(u.semester ? { semester: u.semester } : {}),
        ...(u.entry_year ? { year: u.entry_year } : {}),
      });
    },
    [updateProfile],
  );

  const reset = useCallback(async () => {
    await clearToken();
    setUser(null);
    setStatus("signedOut");
  }, []);

  // Token ditolak server (kedaluwarsa atau dicabut)
  useEffect(() => {
    setUnauthorizedHandler(() => {
      reset();
    });
    return () => setUnauthorizedHandler(null);
  }, [reset]);

  // Saat aplikasi dibuka: cek token tersimpan
  useEffect(() => {
    let alive = true;
    (async () => {
      const token = await getToken();
      if (!token) {
        if (alive) setStatus("signedOut");
        return;
      }
      try {
        const u = await fetchMe();
        if (!alive) return;
        applyUser(u);
        setStatus("signedIn");
      } catch {
        // 401 sudah ditangani handler. Jika hanya koneksi, token dibiarkan.
        if (alive) setStatus("signedOut");
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await login(email, password);
      await setToken(res.token);
      applyUser(res.user);
      setStatus("signedIn");
    },
    [applyUser],
  );

  const signUp = useCallback(
    async (p: {
      name: string;
      email: string;
      password: string;
      confirm: string;
    }) => {
      const res = await register({
        name: p.name,
        email: p.email,
        password: p.password,
        password_confirmation: p.confirm,
      });
      await setToken(res.token);
      applyUser(res.user);
      setStatus("signedIn");
    },
    [applyUser],
  );

  const signOut = useCallback(async () => {
    try {
      await logout(); // mencabut token di server
    } catch {
      // tetap keluar di perangkat walau server tidak terjangkau
    }
    await reset();
  }, [reset]);

  const value = useMemo(
    () => ({ status, user, signIn, signUp, signOut }),
    [status, user, signIn, signUp, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
