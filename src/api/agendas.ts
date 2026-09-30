import { api } from "./client";
import type { Agenda, AgendaCategory } from "@/contexts/AgendaContext";

type ApiAgenda = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  category: AgendaCategory;
  reminder: boolean;
};

function mapAgenda(agenda: ApiAgenda): Agenda {
  return {
    id: agenda.id,
    title: agenda.title,
    description: agenda.description ?? undefined,
    date: agenda.date,
    startTime: agenda.start_time,
    endTime: agenda.end_time,
    category: agenda.category,
    reminder: agenda.reminder,
  };
}

export async function fetchAgendas(): Promise<Agenda[]> {
  const response = await api.get("/agendas");

  return response.data.data.map(mapAgenda);
}

export async function createAgenda(input: Omit<Agenda, "id">) {
  const response = await api.post("/agendas", {
    title: input.title,
    description: input.description,
    date: input.date,
    start_time: input.startTime,
    end_time: input.endTime,
    category: input.category,
    reminder: input.reminder,
  });

  return mapAgenda(response.data.data);
}

export async function updateAgenda(
  id: number,
  patch: Partial<Omit<Agenda, "id">>,
) {
  const response = await api.put(`/agendas/${id}`, {
    ...(patch.title !== undefined && {
      title: patch.title,
    }),
    ...(patch.description !== undefined && {
      description: patch.description,
    }),
    ...(patch.date !== undefined && {
      date: patch.date,
    }),
    ...(patch.startTime !== undefined && {
      start_time: patch.startTime,
    }),
    ...(patch.endTime !== undefined && {
      end_time: patch.endTime,
    }),
    ...(patch.category !== undefined && {
      category: patch.category,
    }),
    ...(patch.reminder !== undefined && {
      reminder: patch.reminder,
    }),
  });

  return mapAgenda(response.data.data);
}

export async function deleteAgenda(id: number) {
  await api.delete(`/agendas/${id}`);
}
