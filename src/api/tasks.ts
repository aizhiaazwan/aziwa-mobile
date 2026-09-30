import { api } from "./client";
import type { Task, Priority, Status } from "@/data/dummy";

type ApiTask = {
  id: number;
  course_id: number | null;
  title: string;
  description: string | null;
  deadline: string;
  priority: Priority;
  status: Status;
  subtasks_done: number;
  subtasks_total: number;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function mapTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    courseId: task.course_id ?? 0,
    deadline: task.deadline,
    priority: task.priority,
    status: task.status,

    subtasks:
      task.subtasks_total > 0
        ? {
            done: task.subtasks_done,
            total: task.subtasks_total,
          }
        : undefined,

    completedAt: task.completed_at ?? undefined,
  };
}

export async function fetchTasks(params?: {
  status?: Status;
  priority?: Priority;
  courseId?: number;
  deadline?: "today" | "week" | "overdue";
  q?: string;
  sort?: "deadline" | "priority" | "newest";
}): Promise<Task[]> {
  const response = await api.get("/tasks", {
    params: {
      status: params?.status,
      priority: params?.priority,
      course_id: params?.courseId,
      deadline: params?.deadline,
      q: params?.q,
      sort: params?.sort,
    },
  });

  return response.data.data.map(mapTask);
}

export async function createTask(input: {
  title: string;
  courseId: number;
  deadline: string;
  priority: Priority;
  status: Status;
  subtasks?: {
    done: number;
    total: number;
  };
}) {
  const response = await api.post("/tasks", {
    title: input.title,
    course_id: input.courseId,
    deadline: input.deadline,
    priority: input.priority,
    status: input.status,
    subtasks_done: input.subtasks?.done ?? 0,
    subtasks_total: input.subtasks?.total ?? 0,
  });

  return mapTask(response.data.data);
}

export async function updateTask(
  id: number,
  patch: Partial<{
    title: string;
    courseId: number;
    deadline: string;
    priority: Priority;
    status: Status;
    subtasks: {
      done: number;
      total: number;
    };
  }>,
) {
  const response = await api.put(`/tasks/${id}`, {
    ...(patch.title !== undefined && { title: patch.title }),
    ...(patch.courseId !== undefined && { course_id: patch.courseId }),
    ...(patch.deadline !== undefined && { deadline: patch.deadline }),
    ...(patch.priority !== undefined && { priority: patch.priority }),
    ...(patch.status !== undefined && { status: patch.status }),

    ...(patch.subtasks !== undefined && {
      subtasks_done: patch.subtasks.done,
      subtasks_total: patch.subtasks.total,
    }),
  });

  return mapTask(response.data.data);
}

export async function deleteTask(id: number) {
  await api.delete(`/tasks/${id}`);
}
