"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Task, User } from "@/interface/Task.interface";
import { apiCurrentUser, apiGetTasks, apiLogout } from "@/services/api";

interface TaskContextType {
  user: User | null;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  isLoggedIn: boolean;
  currentUser: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAllTasks = async () => {
    setLoading(true);
    try {
      const { todos } = await apiGetTasks();
      setTasks(todos || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = async () => {
    setLoading(true);
    try {
      const data = await apiCurrentUser();
      if (data?.user) {
        setUser(data.user);
        setIsLoggedIn(true);
        await getAllTasks();
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setIsLoggedIn(false);
      setUser(null);
      setTasks([]);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    currentUser();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        user,
        tasks,
        setTasks,
        logout,
        currentUser,
        isLoggedIn,
        loading,
        setLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within TaskProvider");
  return ctx;
};
