import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { IconName } from "@/data/dummy";
import { fetchAgendas, createAgenda } from "@/api/agendas";

export type AgendaCategory =
  | "kuliah"
  | "organisasi"
  | "pkm"
  | "belajar"
  | "olahraga"
  | "acara"
  | "pribadi";

export type Agenda = {
  id: number;
  title: string;
  description?: string;
  date: string; // 'YYYY-MM-DD' (WIB)
  startTime: string; // 'HH:MM'
  endTime: string;
  category: AgendaCategory;
  reminder: boolean;
};

export type NewAgenda = Omit<Agenda, "id">;

export const categoryMeta: Record<
  AgendaCategory,
  { label: string; icon: IconName; fg: string; bg: string }
> = {
  kuliah: { label: "Kuliah", icon: "book-open", fg: "#5B3DE0", bg: "#E6E0FF" },
  organisasi: {
    label: "Organisasi",
    icon: "users",
    fg: "#0F766E",
    bg: "#DDF3F0",
  },
  pkm: { label: "PKM", icon: "briefcase", fg: "#8A5A00", bg: "#FFF3D6" },
  belajar: { label: "Belajar", icon: "edit-3", fg: "#3B5BDB", bg: "#E3EAFF" },
  olahraga: {
    label: "Olahraga",
    icon: "activity",
    fg: "#1FA971",
    bg: "#E3F6EE",
  },
  acara: { label: "Acara", icon: "gift", fg: "#B4237A", bg: "#FBE4F2" },
  pribadi: { label: "Pribadi", icon: "heart", fg: "#6B6B85", bg: "#ECEAF5" },
};

// Data dummy di memori. Di Phase 4 diganti API.
const initial: Agenda[] = [
  {
    id: 1,
    title: "Kuliah Metode Penelitian",
    date: "2026-09-30",
    startTime: "10:00",
    endTime: "11:40",
    category: "kuliah",
    reminder: true,
    description: "Ruang 201",
  },
  {
    id: 2,
    title: "Belajar Cisco Packet Tracer",
    date: "2026-09-30",
    startTime: "15:00",
    endTime: "16:30",
    category: "belajar",
    reminder: false,
  },
  {
    id: 3,
    title: "Rapat Organisasi HIMA",
    date: "2026-09-30",
    startTime: "19:30",
    endTime: "21:00",
    category: "organisasi",
    reminder: true,
    description: "Bahas rencana kegiatan bulan Oktober",
  },
  {
    id: 4,
    title: "Kuliah Jaringan Komputer",
    date: "2026-10-01",
    startTime: "08:00",
    endTime: "10:30",
    category: "kuliah",
    reminder: false,
    description: "Lab Jarkom",
  },
  {
    id: 5,
    title: "Futsal bareng teman",
    date: "2026-10-01",
    startTime: "17:00",
    endTime: "18:30",
    category: "olahraga",
    reminder: false,
  },
  {
    id: 6,
    title: "Rapat tim PKM",
    date: "2026-10-03",
    startTime: "13:00",
    endTime: "14:30",
    category: "pkm",
    reminder: true,
  },
  {
    id: 7,
    title: "Seminar Nasional Teknologi",
    date: "2026-10-05",
    startTime: "09:00",
    endTime: "12:00",
    category: "acara",
    reminder: false,
  },
];

type Value = {
  agendas: Agenda[];
  loading: boolean;
  error: string | null;
  refreshAgendas: () => Promise<void>;
  addAgenda: (input: NewAgenda) => void;
  updateAgenda: (id: number, patch: Partial<NewAgenda>) => void;
  removeAgenda: (id: number) => void;
};

const AgendaContext = createContext<Value | null>(null);

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAgendas = useCallback(async () => {
    useEffect(() => {
      refreshAgendas();
    }, [refreshAgendas]);
    try {
      setError(null);

      const data = await fetchAgendas();
      setAgendas(data);
    } catch (err) {
      console.error("Gagal mengambil agendas:", err);
      setError("Gagal mengambil data agenda.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAgendas();

        if (mounted) {
          setAgendas(data);
        }
      } catch (err) {
        console.error("Gagal mengambil agendas:", err);

        if (mounted) {
          setError("Gagal mengambil data agenda.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const addAgenda = useCallback(async (input: NewAgenda) => {
    try {
      const created = await createAgenda(input);
      setAgendas((prev) => [...prev, created]);
    } catch (err) {
      console.error("Gagal menambahkan agenda:", err);
      throw err;
    }
  }, []);
  const updateAgenda = useCallback((id: number, patch: Partial<NewAgenda>) => {
    setAgendas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  }, []);
  const removeAgenda = useCallback((id: number) => {
    setAgendas((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      agendas,
      loading,
      error,
      refreshAgendas,
      addAgenda,
      updateAgenda,
      removeAgenda,
    }),
    [
      agendas,
      loading,
      error,
      refreshAgendas,
      addAgenda,
      updateAgenda,
      removeAgenda,
    ],
  );
  return (
    <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>
  );
}

export function useAgendas() {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error("useAgendas harus dipakai di dalam AgendaProvider");
  return ctx;
}
