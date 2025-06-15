import { Button } from "@/components/ui/button";
import { PauseCircle, Play, PlayCircle, StopCircle } from "lucide-react";
import type { FC } from "react";

type Props = {
  isIdle: boolean;
  isFinished: boolean;
  isRunning: boolean;
  isPaused: boolean;
  handleStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleStop: () => void;
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
}) => {
  return (
    <div className="flex justify-center items-center space-x-6 py-6 border-t border-gray-200 dark:border-gray-700">
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
          className={"dark:bg-yellow-500 dark:text-white"}
        >
          <PlayCircle size={36} />
          Resume
        </Button>
      )}
      {!isIdle && !isFinished && (
        <Button
          variant={"destructive"}
          onClick={handleStop}
          aria-label="Stop timer"
        >
          <StopCircle size={36} className="mr-2" />
          Stop
        </Button>
      )}
    </div>
  );
};
