import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Course, dummyCourses } from "@/data/dummy";

export type NewCourse = Omit<Course, "id">;

type CoursesContextValue = {
  courses: Course[];
  addCourse: (input: NewCourse) => void;
  updateCourse: (id: number, patch: Partial<NewCourse>) => void;
  removeCourse: (id: number) => void;
};

const CoursesContext = createContext<CoursesContextValue | null>(null);

// Sementara data dummy di memori. Di Phase 4 diganti panggilan API.
export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(dummyCourses);

  const addCourse = useCallback((input: NewCourse) => {
    setCourses((prev) => {
      const nextId = prev.reduce((m, c) => Math.max(m, c.id), 0) + 1;
      return [...prev, { ...input, id: nextId }];
    });
  }, []);

  const updateCourse = useCallback((id: number, patch: Partial<NewCourse>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }, []);

  const removeCourse = useCallback((id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = useMemo(
    () => ({ courses, addCourse, updateCourse, removeCourse }),
    [courses, addCourse, updateCourse, removeCourse],
  );

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx)
    throw new Error("useCourses harus dipakai di dalam CoursesProvider");
  return ctx;
}
