import { type FC } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const Account: FC = () => {
  const { currentUser, logout } = useAuth();
  const { dispatch } = useTraining();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogout = async () => {
    logout()
      .catch((error) => {
        if (error instanceof FirebaseError) {
          toast(`Error ${error.code}: ${error.message}`);
        }
      })
      .then(() => {
        dispatch({ type: "GO_TO_HOME" });
      })
      .finally(() => {
        toast("You have been successfully logged out.", {
          position: "top-center",
        });
      });
  };

  const handleInvite = async ({ email }: z.infer<typeof formSchema>) => {
    console.log(`Inviting ${email}...`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Settings
      </h2>
      {currentUser ? (
        <div className={"grid space-y-6"}>
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Name:</strong> {currentUser.displayName}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>User ID:</strong> {currentUser.uid}
            </p>
          </div>
          <div className={"flex gap-4"}>
            <Button variant={"destructive"} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">No user logged in.</p>
      )}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Invite a Friend
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleInvite)}
            className="space-y-8"
          >
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
            <Button className={"w-full"} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
