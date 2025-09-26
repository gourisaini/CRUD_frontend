import { isAxiosError } from "axios";
import instance from "./axios";
import {
  AddTaskRes,
  AuthRes,
  LoginReq,
  SignInReq,
  Task,
  User,
} from "@/interface/Task.interface";

export const handleApiError = (err: unknown): string => {
  if (isAxiosError(err)) {
    return (err.response?.data?.message as string) || "Something went wrong";
  }
  return "Unexpected error";
};

// ---- AUTH ----
export const apiLogin = async (payload: LoginReq): Promise<AuthRes> => {
  const { data } = await instance.post<AuthRes>("/login", payload);
  return data;
};

export const apiSignup = async (payload: SignInReq): Promise<AuthRes> => {
  const { data } = await instance.post<AuthRes>("/signup", payload);
  return data;
};

export const apiCurrentUser = async (): Promise<{ user?: User }> => {
  const { data } = await instance.get<{ user?: User }>("/current");
  return data;
};

export const apiLogout = async (): Promise<void> => {
  await instance.get("/signout");
};

// ---- TASKS ----
export const apiGetTasks = async (): Promise<{ todos: Task[] }> => {
  const { data } = await instance.get<{ todos: Task[] }>("/todo");
  return data;
};

export const apiAddTask = async (task: Task): Promise<AddTaskRes> => {
  const { data } = await instance.post<AddTaskRes>("/todo", task);
  return data;
};

export const apiUpdateTask = async (
  id: string,
  task: Partial<Task>
): Promise<AddTaskRes> => {
  const { data } = await instance.put(`/todo/${id}`, task);
  return data;
};

export const apiDeleteTask = async (
  id: string
): Promise<{ success: boolean }> => {
  const { data } = await instance.delete(`/todo/${id}`);
  return data;
};

export const apiToggleTask = async (
  id: string
): Promise<{ success: boolean }> => {
  const { data } = await instance.patch(`/todo/${id}/toggle`);
  return data;
};
