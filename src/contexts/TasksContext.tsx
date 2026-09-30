import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Status, Task } from "@/data/dummy";
import { createTask, deleteTask, fetchTasks, updateTask } from "@/api/tasks";

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
  setStatus: (id: number, status: Status) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  addTask: (input: NewTask) => Promise<void>;
  removeByCourse: (courseId: number) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export type NewTask = Omit<Task, "id">;

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchTasks();

      setTasks(data);
    } catch (err) {
      console.error("Gagal mengambil tasks:", err);

      setError("Gagal mengambil data tugas.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchTasks();

        if (mounted) {
          setTasks(data);
        }
      } catch (err) {
        console.error("Gagal mengambil tasks:", err);

        if (mounted) {
          setError("Gagal mengambil data tugas.");
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

  const toggleComplete = useCallback(
    async (id: number) => {
      const current = tasks.find((task) => task.id === id);

      if (!current) return;

      const nextStatus: Status =
        current.status === "completed" ? "pending" : "completed";

      try {
        const updated = await updateTask(id, {
          title: current.title,
          courseId: current.courseId,
          deadline: current.deadline,
          priority: current.priority,
          status: nextStatus,
          subtasks: current.subtasks,
        });

        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task)),
        );
      } catch (err) {
        console.error("Gagal mengubah status task:", err);

        throw err;
      }
    },
    [tasks],
  );

  const setStatus = useCallback(
    async (id: number, status: Status) => {
      const current = tasks.find((task) => task.id === id);

      if (!current) return;

      try {
        const updated = await updateTask(id, {
          title: current.title,
          courseId: current.courseId,
          deadline: current.deadline,
          priority: current.priority,
          status,
          subtasks: current.subtasks,
        });

        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task)),
        );
      } catch (err) {
        console.error("Gagal mengubah status task:", err);

        throw err;
      }
    },
    [tasks],
  );

  const removeTask = useCallback(async (id: number) => {
    try {
      await deleteTask(id);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Gagal menghapus task:", err);

      throw err;
    }
  }, []);

  const addTask = useCallback(async (input: NewTask) => {
    try {
      const created = await createTask({
        title: input.title,
        courseId: input.courseId,
        deadline: input.deadline,
        priority: input.priority,
        status: input.status,
        subtasks: input.subtasks,
      });

      setTasks((prev) => [...prev, created]);
    } catch (err) {
      console.error("Gagal menambahkan task:", err);

      throw err;
    }
  }, []);

  const removeByCourse = useCallback(
    async (courseId: number) => {
      const relatedTasks = tasks.filter((task) => task.courseId === courseId);

      try {
        await Promise.all(relatedTasks.map((task) => deleteTask(task.id)));

        setTasks((prev) => prev.filter((task) => task.courseId !== courseId));
      } catch (err) {
        console.error("Gagal menghapus task berdasarkan course:", err);

        throw err;
      }
    },
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      refreshTasks,
      toggleComplete,
      setStatus,
      removeTask,
      addTask,
      removeByCourse,
    }),
    [
      tasks,
      loading,
      error,
      refreshTasks,
      toggleComplete,
      setStatus,
      removeTask,
      addTask,
      removeByCourse,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);

  if (!ctx) {
    throw new Error("useTasks harus dipakai di dalam TasksProvider");
  }

  return ctx;
}
