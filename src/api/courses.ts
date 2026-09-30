import { api } from "./client";
import type { Course } from "@/data/dummy";

type ApiCourse = {
  id: number;
  name: string;
  code: string;
  sks: number;
  lecturer: string | null;
  day: number;
  start_time: string;
  end_time: string;
  room: string | null;
  semester: number | null;
  description: string | null;
  icon: Course["icon"];
  tone: Course["tone"];
  stripe: string;
  tasks_count?: number;
  active_tasks_count?: number;
};

function mapCourse(course: ApiCourse): Course {
  return {
    id: course.id,
    name: course.name,
    code: course.code,
    sks: course.sks,
    lecturer: course.lecturer ?? "",
    day: course.day,
    startTime: course.start_time,
    endTime: course.end_time,
    room: course.room ?? "",
    description: course.description ?? undefined,
    icon: course.icon,
    tone: course.tone,
    stripe: course.stripe,
  };
}

export async function fetchCourses(params?: { q?: string }): Promise<Course[]> {
  const response = await api.get("/courses", {
    params: {
      q: params?.q,
    },
  });

  return response.data.data.map(mapCourse);
}

export async function createCourse(input: Omit<Course, "id">) {
  const response = await api.post("/courses", {
    name: input.name,
    code: input.code,
    sks: input.sks,
    lecturer: input.lecturer,
    day: input.day,
    start_time: input.startTime,
    end_time: input.endTime,
    room: input.room,
    description: input.description,
    icon: input.icon,
    tone: input.tone,
    stripe: input.stripe,
  });

  return mapCourse(response.data.data);
}

export async function updateCourse(
  id: number,
  patch: Partial<Omit<Course, "id">>,
) {
  const response = await api.put(`/courses/${id}`, {
    ...(patch.name !== undefined && { name: patch.name }),
    ...(patch.code !== undefined && { code: patch.code }),
    ...(patch.sks !== undefined && { sks: patch.sks }),
    ...(patch.lecturer !== undefined && { lecturer: patch.lecturer }),
    ...(patch.day !== undefined && { day: patch.day }),
    ...(patch.startTime !== undefined && { start_time: patch.startTime }),
    ...(patch.endTime !== undefined && { end_time: patch.endTime }),
    ...(patch.room !== undefined && { room: patch.room }),
    ...(patch.description !== undefined && {
      description: patch.description,
    }),
    ...(patch.icon !== undefined && { icon: patch.icon }),
    ...(patch.tone !== undefined && { tone: patch.tone }),
    ...(patch.stripe !== undefined && { stripe: patch.stripe }),
  });

  return mapCourse(response.data.data);
}

export async function deleteCourse(id: number) {
  await api.delete(`/courses/${id}`);
}
