import { Feather } from "@expo/vector-icons";

export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "in_progress" | "completed";
export type IconName = React.ComponentProps<typeof Feather>["name"];

export type Course = {
  id: number;
  name: string;
  icon: IconName;
  tone: "primary" | "accent";
};

export type Task = {
  id: number;
  title: string;
  courseId: number;
  deadline: string; // ISO dengan zona WIB (+07:00)
  priority: Priority;
  status: Status;
};

export const dummyUser = { name: "Aizhia Azwan", firstName: "Aizhia" };

// "Sekarang" dikunci agar tampilan sama dengan desain. Diganti new Date() saat data dari API.
export const NOW = new Date("2026-09-30T09:59:00+07:00");

export const dummyCourses: Course[] = [
  { id: 1, name: "Web Programming", icon: "code", tone: "primary" },
  { id: 2, name: "Machine Learning", icon: "cpu", tone: "accent" },
  { id: 3, name: "Metode Penelitian", icon: "book-open", tone: "primary" },
  { id: 4, name: "Jaringan Komputer", icon: "share-2", tone: "primary" },
  {
    id: 5,
    name: "Analisis & Perancangan Sistem",
    icon: "layers",
    tone: "primary",
  },
];

export const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Membuat CRUD Laravel & Sanctum",
    courseId: 1,
    deadline: "2026-09-30T23:59:00+07:00",
    priority: "high",
    status: "pending",
  },
  {
    id: 2,
    title: "Analisis Klasifikasi Random Forest",
    courseId: 2,
    deadline: "2026-10-02T17:00:00+07:00",
    priority: "medium",
    status: "in_progress",
  },
  {
    id: 3,
    title: "Draft Bab 1-3 Proposal Skripsi",
    courseId: 3,
    deadline: "2026-10-05T20:00:00+07:00",
    priority: "low",
    status: "in_progress",
  },
  {
    id: 4,
    title: "Simulasi Topologi Jaringan Cisco",
    courseId: 4,
    deadline: "2026-10-10T23:59:00+07:00",
    priority: "medium",
    status: "pending",
  },
];

// Angka statis sesuai desain. Nanti dihitung dari API.
export const dummyStats = { total: 12, pending: 4, progress: 5, done: 3 };
