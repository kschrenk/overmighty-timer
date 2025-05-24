import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { FirebaseError } from "firebase/app";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export default function AuthForm() {
  const { login, loginAsTestUser } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
    setAuthError(null);
    try {
      await login(email, password);
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
