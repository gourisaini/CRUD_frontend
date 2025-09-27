export interface LoginReq {
  email: string;
  password: string;
}

export interface SignInReq {
  name: string;
  email: string;
  contact: string;
  password: string;
}

export interface AuthRes {
  success: boolean;
  id: string;
  token: string;
}

export interface User {
  id: string;
  name: string;
  contact: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  user: string;
  id: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddTaskRes {
  success: boolean;
  message: string;
  todo: Task;
}

export interface AllTasks {
  success: boolean;
  todos: Task[];
}
