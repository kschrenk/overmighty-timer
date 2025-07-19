import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  PauseCircle,
  Play,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import type { FC } from "react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { toast } from "sonner";

type Props = {
  isIdle: boolean;
  isFinished: boolean;
  isRunning: boolean;
  isPaused: boolean;
  handleStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleStop: () => void;
  handleRestart: () => void;
};

export const TrainingTimerControls: FC<Props> = ({
  isIdle,
  handleResume,
  handleStop,
  handleStart,
  handlePause,
  isPaused,
  isRunning,
  isFinished,
  handleRestart,
}) => {
  const { dispatch } = useTraining();

  if (isFinished) {
    return (
      <div className="flex justify-center items-center space-x-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={() => {
            dispatch({ type: "RESET_TIMER" });
            dispatch({ type: "GO_TO_HOME" });
            toast.success("Congratulations! Training completed successfully.", {
              duration: 3000,
              position: "top-center",
            });
          }}
          variant={"outline"}
          className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
          aria-label="Stop timer"
        >
          <ArrowLeft />
          Return to Home
        </Button>
        <Button
          onClick={handleRestart}
          className="p-5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
          aria-label="Restart timer"
        >
          <Play size={36} className="mr-2" />
          Restart
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center space-x-6 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
      {isIdle && !isFinished && (
        <Button
          onClick={handleStart}
          className="p-5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
          aria-label="Start timer"
        >
          <Play size={36} className="mr-2" />
          Start
        </Button>
      )}
      {isRunning && (
        <Button
          onClick={handlePause}
          aria-label="Pause timer"
          variant={"default"}
        >
          <PauseCircle size={36} />
          Pause
        </Button>
      )}
      {isPaused && (
        <Button
          onClick={handleResume}
          aria-label="Resume timer"
          variant={"default"}
          className={"dark:bg-yellow-600 dark:text-white"}
        >
          <PlayCircle size={36} />
          Resume
        </Button>
      )}
      {!isIdle && !isFinished && (
        <Button
          variant={"outline"}
          onClick={handleStop}
          aria-label="Stop timer"
          size={"lg"}
        >
          <StopCircle size={36} className="mr-2" />
          Stop
        </Button>
      )}
    </div>
  );
};
