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
import { createInvite } from "@/lib/firestoreUtils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useWakeLock } from "@/hooks/useWakeLock";
import { Footer } from "@/components/Footer";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const Account: FC = () => {
  const { currentUser, logout } = useAuth();
  const { dispatch } = useTraining();
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const { isSupported } = useWakeLock();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    logout()
      .catch((error) => {
        if (error instanceof FirebaseError) {
          toast(`Error ${error.code}: ${error.message}`);
        }
        setIsLogoutLoading(false);
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
    if (!currentUser) {
      toast.error("You must be logged in to invite friends.");
      return;
    }

    setIsInviteLoading(true);
    createInvite(currentUser, email)
      .then(() => {
        toast.success(`Invite sent to ${email}`, { position: "top-center" });
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(`Failed to send invite: ${error.message}`, {
            position: "top-center",
          });
        }
        setIsInviteLoading(false);
      })
      .finally(() => {
        dispatch({ type: "GO_TO_HOME" });
      });
  };

  return (
    <>
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
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Wake Lock Support:</strong> {String(isSupported)}
              </p>
            </div>
            <div className={"flex gap-4 justify-end"}>
              <Button
                variant={"destructive"}
                onClick={handleLogout}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out
                  </>
                ) : (
                  "Logout"
                )}
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
              <div className={"flex justify-end"}>
                <Button type="submit" disabled={isInviteLoading}>
                  {isInviteLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inviting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
};
