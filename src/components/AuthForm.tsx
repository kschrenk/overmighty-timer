// components/AuthForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { FirebaseError } from "firebase/app";

type FormData = {
  email: string;
  password: string;
};

export default function AuthForm() {
  const { login, signup, loginAsTestUser } = useAuth();
  const [isLogin] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setAuthError(null);
    try {
      if (isLogin) {
        console.log("🚀 onSubmit:", { data });
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(`Firebase error code: ${error.code}`);
        console.error(`Firebase error message: ${error.message}`);
        setAuthError(error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full px-3 py-2 border rounded-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {authError && <p className="text-red-500 text-sm">{authError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <button
        type="button"
        onClick={loginAsTestUser}
        className="w-full mt-12 border border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        Continue as Test User
      </button>
    </div>
  );
}
