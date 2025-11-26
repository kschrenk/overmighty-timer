import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export const authFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;

interface AuthFormDisplayProps {
  form: UseFormReturn<AuthFormValues>;
  onSubmit: (values: AuthFormValues) => void;
  authError: string | null;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  loginAsTestUser: () => void;
  onForgotPassword: () => void;
}

export default function AuthFormDisplay({
  form,
  onSubmit,
  authError,
  showPassword,
  togglePasswordVisibility,
  loginAsTestUser,
  onForgotPassword,
}: AuthFormDisplayProps) {
  return (
    <div className={"max-w-sm mx-auto mt-10 p-4"}>
      <Card className={"px-4 pt-4 pb-8"}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
          Login
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="username" />
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
                    className="absolute right-2 bottom-0"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <Button className={"w-full"} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
      <Button
        type="button"
        variant="link"
        className="p-0 mt-4 mx-auto block"
        onClick={onForgotPassword}
      >
        Forgot Password?
      </Button>
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
