import type { Action } from "sonner";

export const helpAction: (email: string | null, error: Error) => Action = (
  email,
  error,
) => {
  return {
    label: "Help",
    onClick: () => {
      const subject = "Help with Invalid Invite";
      const body = `Hello,\n\nI'm having trouble registering with the email: ${email ?? "no email provided"}.\nThe error message is: "${error.message}"\n\nCan you please help?`;
      window.location.href = `mailto:info@overmighty.de?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
    },
  };
};
