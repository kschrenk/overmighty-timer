// components/AuthForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { FirebaseError } from "firebase/app";
import { Label, LabelWrapper } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-sm mx-auto mt-10 p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <LabelWrapper>
          <Label>Email</Label>
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </LabelWrapper>
        <LabelWrapper>
          <Label>Password</Label>
          <Input
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
        </LabelWrapper>

        {authError && <p className="text-red-500 text-sm">{authError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </form>
      <div className={"pt-12"}>
        <Button
          className={"w-full"}
          variant={"outline"}
          type="button"
          onClick={loginAsTestUser}
        >
          Continue as Test User
        </Button>
      </div>
    </div>
  );
}
