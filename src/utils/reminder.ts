import type { Task } from "@/data/dummy";
import type { Agenda } from "@/contexts/AgendaContext";
import {
  ReminderKind,
  ReminderOffset,
  offsetMeta,
} from "@/contexts/RemindersContext";

export type Target = { title: string; whenIso: string };

// Mencari tugas/agenda yang dituju. null jika sudah dihapus.
export function resolveTarget(
  kind: ReminderKind,
  targetId: number,
  tasks: Task[],
  agendas: Agenda[],
): Target | null {
  if (kind === "task") {
    const t = tasks.find((x) => x.id === targetId);
    return t ? { title: t.title, whenIso: t.deadline } : null;
  }
  const a = agendas.find((x) => x.id === targetId);
  return a
    ? { title: a.title, whenIso: `${a.date}T${a.startTime}:00+07:00` }
    : null;
}

// Waktu pengingat berbunyi = waktu target dikurangi offset
export function triggerIso(whenIso: string, offset: ReminderOffset) {
  return new Date(
    new Date(whenIso).getTime() - offsetMeta[offset].ms,
  ).toISOString();
}
