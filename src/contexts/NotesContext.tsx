import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type NoteTag = "kuliah" | "project" | "ide" | "pkm" | "pribadi";

export type Note = {
  id: number;
  title: string;
  content: string;
  date: string; // 'YYYY-MM-DD' (WIB)
  tag: NoteTag;
};

export type NewNote = Omit<Note, "id">;

export const tagMeta: Record<
  NoteTag,
  { label: string; fg: string; bg: string }
> = {
  kuliah: { label: "Kuliah", fg: "#5B3DE0", bg: "#E6E0FF" },
  project: { label: "Project", fg: "#3B5BDB", bg: "#E3EAFF" },
  ide: { label: "Ide", fg: "#8A5A00", bg: "#FFF3D6" },
  pkm: { label: "PKM", fg: "#0F766E", bg: "#DDF3F0" },
  pribadi: { label: "Pribadi", fg: "#6B6B85", bg: "#ECEAF5" },
};

// Data dummy di memori. Di Phase 4 diganti API.
const initial: Note[] = [
  {
    id: 1,
    title: "Catatan Machine Learning",
    content:
      "Random Forest menggabungkan banyak decision tree. Parameter penting: n_estimators, max_depth, min_samples_split. Gunakan cross-validation untuk memilih nilainya.",
    date: "2026-09-29",
    tag: "kuliah",
  },
  {
    id: 2,
    title: "Materi Cisco",
    content:
      "VLAN memisahkan jaringan secara logis. Port access untuk perangkat akhir, port trunk untuk antar switch. Jangan lupa perintah: switchport mode trunk.",
    date: "2026-09-28",
    tag: "kuliah",
  },
  {
    id: 3,
    title: "Ide project",
    content:
      "Aplikasi pengingat kas organisasi: catat iuran, kirim pengingat otomatis, dan rekap bulanan dalam bentuk PDF.",
    date: "2026-09-26",
    tag: "ide",
  },
  {
    id: 4,
    title: "Catatan PKM",
    content:
      "Deadline proposal tanggal 15 Oktober. Bagian yang belum: latar belakang, metode, dan rencana anggaran.",
    date: "2026-09-25",
    tag: "pkm",
  },
];

type Value = {
  notes: Note[];
  addNote: (input: NewNote) => void;
  updateNote: (id: number, patch: Partial<NewNote>) => void;
  removeNote: (id: number) => void;
};

const NotesContext = createContext<Value | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(initial);

  const addNote = useCallback((input: NewNote) => {
    setNotes((prev) => [
      ...prev,
      { ...input, id: prev.reduce((m, n) => Math.max(m, n.id), 0) + 1 },
    ]);
  }, []);
  const updateNote = useCallback((id: number, patch: Partial<NewNote>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);
  const removeNote = useCallback((id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({ notes, addNote, updateNote, removeNote }),
    [notes, addNote, updateNote, removeNote],
  );
  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes harus dipakai di dalam NotesProvider");
  return ctx;
}
