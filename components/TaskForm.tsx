"use client";

import { useForm } from "react-hook-form";
import { useTaskContext } from "@/context/TaskContext";
import { AddTaskRes, Task } from "@/interface/Task.interface";
import { apiAddTask, apiUpdateTask } from "@/services/api";

export default function TaskForm({
  editingTask,
  onCancel,
}: {
  editingTask?: Task;
  onCancel: () => void;
}) {
  const { setTasks } = useTaskContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Task>({
    defaultValues: editingTask || { title: "", description: "" },
  });

  const handleTask = async (data: Task) => {
    try {
      let response: AddTaskRes;
      if (editingTask) {
        response = await apiUpdateTask(editingTask._id, data);
        if (response.success && response.todo) {
          setTasks((prev: Task[]) =>
            prev.map((item) =>
              item._id === editingTask._id
                ? { ...item, ...response.todo }
                : item
            )
          );
        }
      } else {
        response = await apiAddTask(data);
        if (response.success && response.todo) {
          setTasks((prev: Task[]) => [...prev, response.todo]);
        }
      }
    } catch (err) {
      console.error(`${editingTask ? "Update" : "Add"} task error:`, err);
    }
  };

  const onSubmit = async (data: Task) => {
    await handleTask(data);
    reset();
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded shadow space-y-4"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          placeholder="Enter Title"
          {...register("title", { required: "Title is required" })}
          className="w-full border rounded px-3 py-2"
          autoComplete="off"
        />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          placeholder="Enter Description"
          {...register("description")}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          className="bg-neutral-900 hover:bg-neutral-700 text-white px-4 py-2 rounded-full text-sm cursor-pointer"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-200 rounded-full text-sm px-4 py-2 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
