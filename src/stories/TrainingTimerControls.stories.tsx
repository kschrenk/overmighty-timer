import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useCallback, useState } from "react";
import { TrainingTimerControls } from "@/components/TrainingTimerControls";
import type { TrainingContextState } from "@/context/TrainingContext/TrainingContext";
import { initialTimerData } from "@/data/defaultData";
import { Toaster } from "@/components/ui/sonner";
import { TrainingContext } from "@/context/TrainingContext/useTraining";

// A lightweight mock of the TrainingContext state. Only dispatch is used by the component
// (in the finished state to go back home + reset timer and trigger a toast).
const mockTrainingState: TrainingContextState = {
  trainingSessions: [],
  timerData: initialTimerData,
  activeView: "timer",
  editingSession: null,
};

// Local finite states for the controls.
// idle -> running -> paused -> running -> finished (via external button in story)
type LocalStatus = "idle" | "running" | "paused" | "finished";

const meta: Meta<typeof TrainingTimerControls> = {
  title: "Components/TrainingTimerControls",
  component: TrainingTimerControls,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <TrainingContext.Provider
        value={{
          state: mockTrainingState,
          dispatch: (action) => {
            console.log("TrainingContext dispatch (storybook mock):", action);
          },
          loading: false,
          getSessionById: () => undefined,
        }}
      >
        <div className="dark bg-background text-foreground min-w-[360px] p-6 rounded-lg border border-border shadow-sm">
          <Story />
          <Toaster />
        </div>
      </TrainingContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TrainingTimerControls>;

// A helper component to supply stateful handlers for the controls so that the user
// can click through the lifecycle and trigger the toast in the finished view.
const StatefulDemo: React.FC = () => {
  const [status, setStatus] = useState<LocalStatus>("idle");
  const [isRestartPending, setIsRestartPending] = useState(false);

  const handleStart = useCallback(() => setStatus("running"), []);
  const handlePause = useCallback(() => setStatus("paused"), []);
  const handleResume = useCallback(() => setStatus("running"), []);
  const handleStop = useCallback(() => setStatus("idle"), []);
  const handleRestart = useCallback(() => {
    setIsRestartPending(true);
    // Simulate an async restart (e.g., resetting some context state)
    setTimeout(() => {
      setIsRestartPending(false);
      setStatus("running");
    }, 600);
  }, []);

  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isFinished = status === "finished";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Story Controls (not part of component)
        </span>
        <div className="flex gap-2 flex-wrap">
          {status !== "finished" && (
            <button
              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-500 transition"
              onClick={() => setStatus("finished")}
            >
              Simulate Finish
            </button>
          )}
          {status === "finished" && (
            <button
              className="px-2 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-500 transition"
              onClick={() => setStatus("idle")}
            >
              Reset Story State
            </button>
          )}
        </div>
      </div>
      <TrainingTimerControls
        isIdle={isIdle}
        isRunning={isRunning}
        isPaused={isPaused}
        isFinished={isFinished}
        handleStart={handleStart}
        handlePause={handlePause}
        handleResume={handleResume}
        handleStop={handleStop}
        handleRestart={handleRestart}
        isPending={isRestartPending}
      />
      <p className="text-xs text-muted-foreground leading-relaxed">
        Use the buttons above to move through states. Click "Simulate Finish" to
        see the finished view. In the finished view, clicking "Return to Home"
        will fire the toast (check upper center of the screen). "Restart" will
        move back to a running state after a short simulated delay.
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <StatefulDemo />,
};

// A dedicated finished state snapshot for quick testing.
export const FinishedState: Story = {
  render: () => {
    const [isRestartPending, setIsRestartPending] = useState(false);
    const handleRestart = () => {
      setIsRestartPending(true);
      setTimeout(() => setIsRestartPending(false), 600);
    };

    return (
      <TrainingTimerControls
        isIdle={false}
        isRunning={false}
        isPaused={false}
        isFinished={true}
        handleStart={() => {}}
        handlePause={() => {}}
        handleResume={() => {}}
        handleStop={() => {}}
        handleRestart={handleRestart}
        isPending={isRestartPending}
      />
    );
  },
};
