import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { NOW, dummyTasks, Status, Task } from "@/data/dummy";

type TasksContextValue = {
  tasks: Task[];
  toggleComplete: (id: number) => void;
  setStatus: (id: number, status: Status) => void;
  removeTask: (id: number) => void;
  addTask: (input: NewTask) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);
export type NewTask = Omit<Task, 'id'>;

// Sementara data dummy di memori. Di Phase 4 isinya diganti panggilan API,
// sedangkan layar tidak perlu diubah.
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);

  const toggleComplete = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((t): Task => {
        if (t.id !== id) return t;
        return t.status === "completed"
          ? { ...t, status: "pending", completedAt: undefined }
          : { ...t, status: "completed", completedAt: NOW.toISOString() };
      }),
    );
  }, []);

  const setStatus = useCallback((id: number, status: Status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const removeTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTask = useCallback((input: NewTask) => {
    const newTask: Task = {
      ...input,
      id: Date.now(), // Sementara menggunakan timestamp sebagai ID unik
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

    const value = useMemo(
      () => ({ tasks, toggleComplete, setStatus, removeTask, addTask }),
      [tasks, toggleComplete, setStatus, removeTask, addTask],
    );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks harus dipakai di dalam TasksProvider");
  return ctx;
}
