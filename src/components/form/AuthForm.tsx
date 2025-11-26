import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { FirebaseError } from "firebase/app";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthFormValues } from "./AuthForm.display";
import AuthFormDisplay, { authFormSchema } from "./AuthForm.display";

export default function AuthForm() {
  const { login, loginAsTestUser, sendPasswordResetEmail } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setAuthError(null);
    try {
      await login(data.email, data.password);
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

  const onForgotPassword = async () => {
    setAuthError(null);
    const email = form.getValues("email");
    if (!email) {
      setAuthError("Please enter your email address to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(email);
      alert("Password reset email sent. Please check your inbox.");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthFormDisplay
      form={form}
      onSubmit={onSubmit}
      authError={authError}
      showPassword={showPassword}
      togglePasswordVisibility={togglePasswordVisibility}
      loginAsTestUser={loginAsTestUser}
      onForgotPassword={onForgotPassword}
    />
  );
}
