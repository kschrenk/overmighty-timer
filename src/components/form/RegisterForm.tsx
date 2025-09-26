import type { FC } from "react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import useSearchParams from "@/hooks/useSearchParams";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { removeSearchParameters } from "@/lib/removeSearchParameters";
import { Loader2 } from "lucide-react";
import { helpAction } from "@/toast/action";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name is required")
      .max(50, { message: "Name must be not longer than 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine((password) => /[^a-zA-Z0-9\s]/.test(password), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms to register",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const RegisterForm: FC = () => {
  const { signup } = useAuth();
  const { getParam } = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useTraining();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: getParam("invitedEmail") ?? "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async ({
    name,
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    signup({ name, email, password })
      .then(() => {
        dispatch({ type: "GO_TO_HOME" });
      })
      .finally(() => {
        removeSearchParameters();
        toast.success(
          `Welcome ${name}. Enjoy your overmighty hangboard sessions!`,
          { position: "top-center" },
        );
        setIsSubmitting(false);
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message, {
            action: helpAction(email, error),
          });
        }
        setIsSubmitting(false);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={"max-w-sm mx-auto p-4 space-y-8"}>
      <div>
        <h2 className={"text-xl mb-2"}>Register</h2>
        <p className={"text-gray-400 text-sm"}>
          Create your account to start training and create your own sessions.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="username" />
                </FormControl>
                <FormDescription>This is your display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={"relative"}>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="current-password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-5"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
                <FormDescription>
                  Password requirements:
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    <li>At least 6 characters</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (!@#$...)</li>
                  </ul>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className={"relative"}>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-start space-x-3">
                    <input
                      id="termsAccepted"
                      type="checkbox"
                      className="mt-1 h-4 w-4 cursor-pointer rounded border border-gray-600 bg-transparent accent-blue-600"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <div className="space-y-1 text-sm leading-snug">
                      <label
                        htmlFor="termsAccepted"
                        className="font-medium cursor-pointer"
                      >
                        I accept the testing terms & conditions
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        This app runs on Google (Firebase) services and is
                        currently under active testing. Data may be reset and
                        features may change without notice. Do not store
                        sensitive information. You must accept this to register.
                      </p>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className={"w-full"} type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
