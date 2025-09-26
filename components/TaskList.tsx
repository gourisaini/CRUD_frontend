"use client";

import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { Task } from "@/interface/Task.interface";

export default function TaskList() {
  const { tasks } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={handleAddNew}
          className="bg-neutral-900 hover:bg-neutral-700 text-white px-4 py-2 rounded-full text-sm cursor-pointer"
        >
          Add New Task
        </button>
      </div>

      {showForm && (
        <TaskForm
          editingTask={editingTask || undefined}
          onCancel={handleCancel}
        />
      )}

      <div className="space-y-3 mt-6">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks yet</p>
        ) : (
          tasks
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((task) => (
              <TaskItem key={task._id} task={task} onEdit={handleEdit} />
            ))
        )}
      </div>
    </div>
  );
}
