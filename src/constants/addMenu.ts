import type { SheetItem } from "@/components/ui/SheetMenu";

// key = alamat route tujuan
export const addItems: SheetItem[] = [
  { key: "/add-task", label: "Tugas Kuliah", icon: "check-circle" },
  { key: "/add-agenda", label: "Agenda", icon: "calendar" },
  { key: "/add-todo", label: "To-Do", icon: "list" },
  { key: "/add-note", label: "Catatan", icon: "file-text" },
  { key: "/add-reminder", label: "Pengingat", icon: "bell" },
];
