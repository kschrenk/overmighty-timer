import { type FC, useEffect, useState } from "react";
import { Link } from "react-scroll";
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
import { Download, Loader2, Send, Settings, Mail } from "lucide-react";
import { useWakeLock } from "@/hooks/useWakeLock";
import packageJson from "../../package.json";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace(/^#/, "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

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
    <div className="max-w-md mx-auto px-4 py-6">
      <nav className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 -mx-4 px-4 mb-6 border-b">
        <div className="flex h-14 items-center justify-around">
          <Link
            activeClass="text-primary"
            to="settings"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
          <Link
            activeClass="text-primary"
            to="invite-a-friend"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Invite
          </Link>
          <Link
            activeClass="text-primary"
            to="installation-guide"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Installation
          </Link>
          <Link
            activeClass="text-primary"
            to="contact"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </div>
      </nav>
      <div className="grid space-y-6">
        <Card id="settings" className={"bg-transparent border-2"}>
          <CardHeader>
            <CardTitle className={"flex items-center pb-2"}>
              <Settings className={"mr-2"} />
              <span>Settings</span>
            </CardTitle>
            <CardDescription>
              View your account details and application settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Version:</strong> {packageJson.version}
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
              <p className="text-gray-700 dark:text-gray-300">
                No user logged in.
              </p>
            )}
          </CardContent>
        </Card>
        <Card id="invite-a-friend" className={"bg-transparent border-2"}>
          <CardHeader>
            <CardTitle className={"flex items-center pb-2"}>
              <Send className={"mr-2"} />
              <span>Invite a Friend</span>
            </CardTitle>
            <CardDescription>
              Enter your friend's email address below to send them an invitation
              to register for the Overmighty Timer.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                        <Input {...field} autoComplete="email" />
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
          </CardContent>
        </Card>
        <Card id="installation-guide" className={"bg-transparent border-2"}>
          <CardHeader>
            <CardTitle className={"flex items-center pb-2"}>
              <Download className={"mr-2"} />
              <span>Installation Guide</span>
            </CardTitle>
            <CardDescription>
              For the best experience, install this app on your phone's home
              screen to use it like a native app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                Android (using Chrome)
              </h4>
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                <li>Tap the three-dot menu icon in the top-right corner.</li>
                <li>
                  Select <strong>Install app</strong> or{" "}
                  <strong>Add to Home Screen</strong>.
                </li>
                <li>
                  Follow the on-screen prompts to complete the installation.
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                iOS (using Safari)
              </h4>
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                <li>Tap the "Share" icon at the bottom of the screen.</li>
                <li>
                  Scroll down and select <strong>Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong>Add</strong> in the top-right corner to confirm.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
        <Card id="contact" className={"bg-transparent border-2"}>
          <CardHeader>
            <CardTitle className="flex items-center pb-2">
              <Mail className="mr-2" />
              <span>Contact & Feedback</span>
            </CardTitle>
            <CardDescription>
              Need help or want to share an idea? Reach out anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This project is in continuous improvement. If you have issues,
              suggestions, or training feature requests, I’d love to hear from
              you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={() => {
                  const subject = "Overmighty Timer Feedback / Support";
                  const body = `Hello,\n\nI would like to give the following feedback / need help with: \n\n`;
                  window.location.href = `mailto:info@overmighty.de?subject=${encodeURIComponent(
                    subject,
                  )}&body=${encodeURIComponent(body)}`;
                }}
              >
                Email us
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navigator.clipboard
                    .writeText("info@overmighty.de")
                    .then(() =>
                      toast.success("Email copied", { position: "top-center" }),
                    )
                    .catch(() =>
                      toast.error("Copy failed", { position: "top-center" }),
                    );
                }}
              >
                Copy address
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              You can also include device / browser info if reporting a bug.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
