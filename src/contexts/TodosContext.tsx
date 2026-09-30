import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Priority, Status } from "@/data/dummy";

export type Todo = {
  id: number;
  title: string;
  description?: string;
  deadline?: string; // 'YYYY-MM-DD' (WIB), opsional
  priority: Priority;
  status: Status;
};

export type NewTodo = Omit<Todo, "id">;

// Data dummy di memori. Di Phase 4 diganti API.
const initial: Todo[] = [
  {
    id: 1,
    title: "Push project ke GitHub",
    deadline: "2026-09-30",
    priority: "high",
    status: "pending",
  },
  {
    id: 2,
    title: "Belajar Cisco",
    description: "Latihan konfigurasi VLAN",
    deadline: "2026-10-01",
    priority: "medium",
    status: "in_progress",
  },
  { id: 3, title: "Membaca jurnal", priority: "low", status: "pending" },
  { id: 4, title: "Bersihkan laptop", priority: "low", status: "pending" },
  {
    id: 5,
    title: "Olahraga pagi",
    deadline: "2026-09-30",
    priority: "medium",
    status: "completed",
  },
];

type Value = {
  todos: Todo[];
  addTodo: (input: NewTodo) => void;
  updateTodo: (id: number, patch: Partial<NewTodo>) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
};

const TodosContext = createContext<Value | null>(null);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(initial);

  const addTodo = useCallback((input: NewTodo) => {
    setTodos((prev) => [
      ...prev,
      { ...input, id: prev.reduce((m, t) => Math.max(m, t.id), 0) + 1 },
    ]);
  }, []);
  const updateTodo = useCallback((id: number, patch: Partial<NewTodo>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);
  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map(
        (t): Todo =>
          t.id === id
            ? {
                ...t,
                status: t.status === "completed" ? "pending" : "completed",
              }
            : t,
      ),
    );
  }, []);
  const removeTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({ todos, addTodo, updateTodo, toggleTodo, removeTodo }),
    [todos, addTodo, updateTodo, toggleTodo, removeTodo],
  );
  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos harus dipakai di dalam TodosProvider");
  return ctx;
}
