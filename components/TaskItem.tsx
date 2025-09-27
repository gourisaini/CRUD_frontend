'use client';

import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/interface/Task.interface';
import { apiDeleteTask, apiToggleTask } from '@/services/api';

export default function TaskItem({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: (task: Task) => void;
}) {
  const { setTasks } = useTaskContext();

  const deleteTask = async (id: string) => {
    try {
      const data = await apiDeleteTask(id);
      if (data.success) {
        setTasks((prev: Task[]) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const data = await apiToggleTask(id);
      if (data.success) {
        setTasks((prev: Task[]) =>
          prev.map((t) =>
            t._id === id ? { ...t, completed: !t.completed } : t
          )
        );
      }
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 flex justify-between items-start">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task._id)}
          className="mt-1 cursor-pointer"
          aria-label={`Mark ${task.title} as ${
            task.completed ? 'incomplete' : 'complete'
          }`}
        />
        <div>
          <h3
            className={`font-medium ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:opacity-50 text-sm cursor-pointer"
          aria-label="Edit Task"
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(task._id)}
          className="text-red-600 hover:opacity-50 text-sm cursor-pointer"
          aria-label="Delete Task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
