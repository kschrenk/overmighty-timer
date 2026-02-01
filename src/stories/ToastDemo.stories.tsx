import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const ToastDemo = () => {
  const handleStopTimer = () => {
    toast.warning("Stop the timer?", {
      description: "This will reset the current session progress.",
      position: "top-center",
      closeButton: true,
      duration: Infinity,
      action: {
        label: "OK",
        onClick: () => {
          toast.success("Timer stopped and returned to home");
        },
      },
    });
  };

  const handleSuccess = () => {
    toast.success("Congratulations! Training completed successfully.", {
      duration: 3000,
      position: "top-center",
    });
  };

  const handleError = () => {
    toast.error("Something went wrong!");
  };

  const handleInfo = () => {
    toast.info("Timer paused");
  };

  return (
    <div className="dark p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Toast Components</h1>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Button onClick={handleStopTimer} variant="destructive">
          Stop Timer Toast
        </Button>

        <Button onClick={handleSuccess} variant="default">
          Success Toast
        </Button>

        <Button onClick={handleError} variant="outline">
          Error Toast
        </Button>

        <Button onClick={handleInfo} variant="secondary">
          Info Toast
        </Button>
      </div>

      <Toaster />
    </div>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: "Components/Toast",
  component: ToastDemo,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ToastDemo>;

export const Default: Story = {};
