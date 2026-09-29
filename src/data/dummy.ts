import { Feather } from "@expo/vector-icons";

export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "in_progress" | "completed";
export type IconName = React.ComponentProps<typeof Feather>["name"];

export type Course = {
  id: number;
  name: string;
  code: string;
  sks: number;
  lecturer: string;
  day: number; // 0=Minggu, 1=Senin, ... 6=Sabtu (sama dengan Date.getDay)
  startTime: string; // 'HH:MM'
  endTime: string; // 'HH:MM'
  room: string;
  description?: string;
  icon: IconName;
  tone: "primary" | "accent";
  stripe: string; // warna garis kiri kartu
};

export type Task = {
  id: number;
  title: string;
  courseId: number;
  deadline: string; // ISO dengan zona WIB (+07:00)
  priority: Priority;
  status: Status;
  subtasks?: { done: number; total: number };
  reminder?: string;
  completedAt?: string;
};

export const dummyUser = { name: "Aizhia Azwan", firstName: "Aizhia" };

// "Sekarang" dikunci agar tampilan sama dengan desain. Diganti new Date() saat data dari API.
export const NOW = new Date("2026-09-30T09:59:00+07:00");

export const dummyCourses: Course[] = [
  {
    id: 1,
    name: "Web Programming",
    code: "IF3201",
    sks: 3,
    lecturer: "Dr. Irwan Santoso, M.T.",
    day: 1,
    startTime: "08:00",
    endTime: "10:30",
    room: "Lab Kom 3",
    icon: "code",
    tone: "primary",
    stripe: "#5B3DE0",
  },
  {
    id: 2,
    name: "Machine Learning",
    code: "IF4102",
    sks: 3,
    lecturer: "Prof. Siti Rahma, Ph.D.",
    day: 2,
    startTime: "13:00",
    endTime: "15:30",
    room: "Gd. Teori 4.2",
    icon: "cpu",
    tone: "accent",
    stripe: "#C99A00",
  },
  {
    id: 3,
    name: "Metode Penelitian",
    code: "IF3105",
    sks: 2,
    lecturer: "Dr. Hendra Wijaya",
    day: 3,
    startTime: "10:00",
    endTime: "11:40",
    room: "Ruang 201",
    icon: "book-open",
    tone: "primary",
    stripe: "#7B5FD6",
  },
  {
    id: 4,
    name: "Jaringan Komputer",
    code: "IF2204",
    sks: 3,
    lecturer: "Ahmad Fauzi, M.Kom.",
    day: 4,
    startTime: "08:00",
    endTime: "10:30",
    room: "Lab Jarkom",
    icon: "share-2",
    tone: "primary",
    stripe: "#C7B8FF",
  },
  {
    id: 5,
    name: "Analisis & Perancangan Sistem",
    code: "IF3208",
    sks: 3,
    lecturer: "Dewi Lestari, S.T., M.Sc.",
    day: 5,
    startTime: "09:00",
    endTime: "11:30",
    room: "Ruang 304",
    icon: "layers",
    tone: "primary",
    stripe: "#8A8AA0",
  },
];
export const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Membuat Landing Page",
    courseId: 1,
    deadline: "2026-10-01T23:59:00+07:00",
    priority: "high",
    status: "pending",
    subtasks: { done: 2, total: 4 },
  },
  {
    id: 2,
    title: "Laporan Machine Learning",
    courseId: 2,
    deadline: "2026-10-03T23:59:00+07:00",
    priority: "medium",
    status: "in_progress",
    subtasks: { done: 3, total: 5 },
  },
  {
    id: 3,
    title: "Proposal Penelitian",
    courseId: 3,
    deadline: "2026-10-05T23:59:00+07:00",
    priority: "high",
    status: "pending",
  },
  {
    id: 4,
    title: "Topologi Jaringan",
    courseId: 4,
    deadline: "2026-10-07T23:59:00+07:00",
    priority: "low",
    status: "completed",
    completedAt: "2026-09-29T15:00:00+07:00",
  },
];
export const dummyStats = { total: 12, pending: 4, progress: 5, done: 3 };