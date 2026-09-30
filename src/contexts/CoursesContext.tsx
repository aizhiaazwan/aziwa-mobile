import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Course } from "@/data/dummy";
import {
  createCourse,
  deleteCourse,
  fetchCourses,
  updateCourse,
} from "@/api/courses";

export type NewCourse = Omit<Course, "id">;

type CoursesContextValue = {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refreshCourses: () => Promise<void>;
  addCourse: (input: NewCourse) => Promise<void>;
  updateCourse: (id: number, patch: Partial<NewCourse>) => Promise<void>;
  removeCourse: (id: number) => Promise<void>;
};

const CoursesContext = createContext<CoursesContextValue | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCourses = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchCourses();

      setCourses(data);
    } catch (err) {
      console.error("Gagal mengambil courses:", err);
      setError("Gagal mengambil data mata kuliah.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCourses();

        if (mounted) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Gagal mengambil courses:", err);

        if (mounted) {
          setError("Gagal mengambil data mata kuliah.");
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

  const addCourse = useCallback(async (input: NewCourse) => {
    try {
      const created = await createCourse(input);

      setCourses((prev) => [...prev, created]);
    } catch (err) {
      console.error("Gagal menambahkan course:", err);
      throw err;
    }
  }, []);

  const updateCourseData = useCallback(
    async (id: number, patch: Partial<NewCourse>) => {
      const current = courses.find((course) => course.id === id);

      if (!current) return;

      try {
        const updated = await updateCourse(id, {
          ...current,
          ...patch,
        });

        setCourses((prev) =>
          prev.map((course) => (course.id === id ? updated : course)),
        );
      } catch (err) {
        console.error("Gagal mengubah course:", err);
        throw err;
      }
    },
    [courses],
  );

  const removeCourse = useCallback(async (id: number) => {
    try {
      await deleteCourse(id);

      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      console.error("Gagal menghapus course:", err);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      courses,
      loading,
      error,
      refreshCourses,
      addCourse,
      updateCourse: updateCourseData,
      removeCourse,
    }),
    [
      courses,
      loading,
      error,
      refreshCourses,
      addCourse,
      updateCourseData,
      removeCourse,
    ],
  );

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CoursesContext);

  if (!ctx) {
    throw new Error("useCourses harus dipakai di dalam CoursesProvider");
  }

  return ctx;
}
