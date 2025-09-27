'use client';

import { TaskProvider, useTaskContext } from '@/context/TaskContext';
import AuthForm from '@/components/AuthForm';
import TaskList from '@/components/TaskList';

function HomePageContent() {
  const { isLoggedIn, user, logout, loading } = useTaskContext();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AuthForm />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="animate-pulse italic">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-semibold">Task Manager</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="text-red-600 text-sm cursor-pointer hover:opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <TaskList />
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <TaskProvider>
      <HomePageContent />
    </TaskProvider>
  );
}
