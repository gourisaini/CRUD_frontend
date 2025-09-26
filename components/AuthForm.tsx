"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTaskContext } from "@/context/TaskContext";
import { AuthRes, LoginReq, SignInReq } from "@/interface/Task.interface";
import { apiLogin, apiSignup, handleApiError } from "@/services/api";

type AuthFormInputs = LoginReq & Partial<SignInReq>;

export default function AuthForm() {
  const { currentUser } = useTaskContext();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormInputs>();

  const handleAuth = async (
    fn: (data: any) => Promise<AuthRes>,
    data: LoginReq | SignInReq
  ) => {
    setLocalLoading(true);
    try {
      const res = await fn(data);

      if (res.success) {
        await currentUser();
        setError("");
      }
      return res;
    } catch (err) {
      console.error(err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormInputs) => {
    setError("");
    if (isSignup) {
      await handleAuth(apiSignup, {
        name: data.name!,
        email: data.email,
        password: data.password,
        contact: data.contact!,
      });
    } else {
      await handleAuth(apiLogin, {
        email: data.email,
        password: data.password,
      });
    }
  };

  const toggleMode = () => {
    reset();
    setIsSignup(!isSignup);
    setError("");
    setShowPassword(false); // Reset password visibility when toggling modes
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        {isSignup ? "Sign Up" : "Sign In"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isSignup && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                {...register("name", { required: "Name is required" })}
                className="w-full border rounded px-3 py-2"
                disabled={localLoading}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <input
                type="tel"
                placeholder="Enter Contact"
                {...register("contact", {
                  required: "Contact is required",
                  pattern: {
                    value: /^\d{10,15}$/,
                    message:
                      "Contact must be a valid phone number (10-15 digits)",
                  },
                })}
                className="w-full border rounded px-3 py-2"
                disabled={localLoading}
              />
              {errors.contact && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email is invalid",
              },
            })}
            className="w-full border rounded px-3 py-2"
            disabled={localLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          {" "}
          {/* Wrapper for password toggle */}
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"} // Dynamic type
            placeholder="Enter Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full border rounded pr-10 px-3 py-2" // Added pr-10 for icon space
            disabled={localLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={localLoading}
            className="absolute right-3 top-[2.5rem] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.828M6.228 6.228L3 3m3.228 3.228a9.452 9.452 0 0111.544 0m-11.544 0L21 21"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={localLoading}
          className="w-full bg-neutral-900 text-white py-2 rounded hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
        >
          {localLoading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="mt-4 text-center">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="button"
          onClick={toggleMode}
          disabled={localLoading}
          className="text-blue-600 text-sm cursor-pointer hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSignup
            ? "Already have an account? Sign In"
            : "Don’t have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
