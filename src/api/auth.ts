import { api } from "./client";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  university: string | null;
  program: string | null;
  semester: number | null;
  entry_year: number | null;
  avatar: string | null;
};

type AuthResult = { user: ApiUser; token: string };

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data } = await api.post("/login", { email, password });
  return data.data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResult> {
  const { data } = await api.post("/register", payload);
  return data.data;
}

export async function logout(): Promise<void> {
  await api.post("/logout");
}

export async function fetchMe(): Promise<ApiUser> {
  const { data } = await api.get("/user");
  return data.data;
}
