import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type ReminderKind = "task" | "agenda";
export type ReminderOffset = "7d" | "3d" | "1d" | "3h" | "1h";

export type Reminder = {
  id: number;
  kind: ReminderKind;
  targetId: number; // id tugas atau id agenda
  offset: ReminderOffset;
  enabled: boolean;
};

export type NewReminder = Omit<Reminder, "id">;

const HOUR = 3600 * 1000;
export const offsetMeta: Record<ReminderOffset, { label: string; ms: number }> =
  {
    "7d": { label: "7 hari sebelum", ms: 168 * HOUR },
    "3d": { label: "3 hari sebelum", ms: 72 * HOUR },
    "1d": { label: "1 hari sebelum", ms: 24 * HOUR },
    "3h": { label: "3 jam sebelum", ms: 3 * HOUR },
    "1h": { label: "1 jam sebelum", ms: 1 * HOUR },
  };

// Data dummy di memori. Di Phase 4 diganti API.
const initial: Reminder[] = [
  { id: 1, kind: "task", targetId: 1, offset: "1d", enabled: true },
  { id: 2, kind: "task", targetId: 2, offset: "3h", enabled: true },
  { id: 3, kind: "agenda", targetId: 3, offset: "1h", enabled: false },
  { id: 4, kind: "agenda", targetId: 4, offset: "1h", enabled: true },
];

type Value = {
  reminders: Reminder[];
  addReminder: (input: NewReminder) => void;
  updateReminder: (id: number, patch: Partial<NewReminder>) => void;
  toggleReminder: (id: number) => void;
  removeReminder: (id: number) => void;
};

const RemindersContext = createContext<Value | null>(null);

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>(initial);

  const addReminder = useCallback((input: NewReminder) => {
    setReminders((prev) => [
      ...prev,
      { ...input, id: prev.reduce((m, r) => Math.max(m, r.id), 0) + 1 },
    ]);
  }, []);
  const updateReminder = useCallback(
    (id: number, patch: Partial<NewReminder>) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );
    },
    [],
  );
  const toggleReminder = useCallback((id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  }, []);
  const removeReminder = useCallback((id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      reminders,
      addReminder,
      updateReminder,
      toggleReminder,
      removeReminder,
    }),
    [reminders, addReminder, updateReminder, toggleReminder, removeReminder],
  );
  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
}

export function useReminders() {
  const ctx = useContext(RemindersContext);
  if (!ctx)
    throw new Error("useReminders harus dipakai di dalam RemindersProvider");
  return ctx;
}
