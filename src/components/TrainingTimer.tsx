import React, { useEffect, useState } from "react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { TimerState, TimerViewEnum } from "@/types/training";
import { formatTime, getStateDescription } from "@/utils/timerUtils";
import { PauseCircle, Play, PlayCircle, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { TrainingTimerInfoContainer } from "@/components/TrainingTimerInfo";
import { useWakeLock } from "@/hooks/useWakeLock";

const TrainingTimer: React.FC = () => {
  const { state, dispatch } = useTraining();
  const [progress, setProgress] = useState(100);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const { timerData } = state;
  const { currentSession, currentSetIndex, timerState } = timerData;
  const currentSet = currentSession?.sets[currentSetIndex] ?? null;

  useEffect(() => {
    (async () => {
      await requestWakeLock();
      return () => {
        releaseWakeLock();
      };
    })();
  }, [releaseWakeLock, requestWakeLock]);

  useEffect(() => {
    const { timerState } = timerData;
    let currentTime = 0;

    switch (timerState) {
      case TimerState.HANGING:
        currentTime = currentSet?.hangTime ?? 0;
        break;
      case TimerState.RESTING_BETWEEN_REPS:
        currentTime = currentSet?.rest ?? 0;
        break;
      case TimerState.RESTING_AFTER_SET:
        currentTime = currentSet?.restAfter ?? 0;
        break;
      case TimerState.PREPARATION:
        currentTime = currentSession?.preparationTime ?? 0;
        break;
      default:
        currentTime = 0;
        break;
    }

    if (!currentTime) return;

    const rawProgress =
      ((currentTime - timerData.secondsLeft) * 100) / currentTime;

    setProgress(Math.max(0, Math.min(100, rawProgress)));
  }, [
    currentSet?.hangTime,
    currentSet?.rest,
    currentSet?.restAfter,
    currentSession?.preparationTime,
    timerData,
    timerData.secondsLeft,
    timerState,
  ]);

  const handleStart = () => {
    if (currentSession) {
      dispatch({ type: "START_SESSION", payload: currentSession });
    }
  };

  const handleStop = () => {
    toast("Are you sure you want to stop the timer?", {
      position: "top-center",
      action: {
        label: "OK",
        onClick: () => {
          dispatch({ type: "RESET_TIMER" });
          dispatch({ type: "GO_TO_HOME" });
        },
      },
    });
  };

  const handlePause = () => {
    dispatch({ type: "PAUSE_TIMER", payload: timerState });
  };

  const handleResume = () => {
    dispatch({ type: "RESUME_TIMER" });
  };

  if (!currentSession || !currentSet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No active training session
        </p>
        <Button
          onClick={() => dispatch({ type: "GO_TO_HOME" })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-xs"
        >
          Go to Home
        </Button>
      </div>
    );
  }

  const getProgressColor = (timerView?: TimerViewEnum) => {
    switch (timerState) {
      case TimerState.HANGING:
        return timerView === TimerViewEnum.BAR
          ? "bg-green-600"
          : "var(--color-green-600)";
      case TimerState.RESTING_BETWEEN_REPS:
      case TimerState.RESTING_AFTER_SET:
        return timerView === TimerViewEnum.BAR
          ? "bg-red-600"
          : "var(--color-red-600)";
      case TimerState.PREPARATION:
        return timerView === TimerViewEnum.BAR
          ? "bg-yellow-600"
          : "var(--color-yellow-600)";
      default:
        return timerView === TimerViewEnum.BAR
          ? "bg-gray-300"
          : "var(--color-gray-300)";
    }
  };

  const isIdle = timerState === TimerState.IDLE;
  const isFinished = timerState === TimerState.FINISHED;
  const isPaused = timerState === TimerState.PAUSED;
  const isRunning = !isIdle && !isFinished && !isPaused;
  const isTimerViewBar = currentSession.timerView === TimerViewEnum.BAR;

  return (
    <div
      className={`max-w-md mx-auto py-4 flex flex-col min-h-[calc(100vh-4rem)] ${!isTimerViewBar ? "px-6" : "px-0"}`}
    >
      <div className="grow flex flex-col items-center justify-center py-8 relative">
        {isTimerViewBar ? (
          <>
            <Progress
              value={progress}
              classNameIndicator={getProgressColor(currentSession.timerView)}
              className={"absolute inset-0 h-full rounded-none"}
            />
            <div className="relative w-64 h-64 mb-6 z-50">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-8xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  {formatTime(timerData.secondsLeft)}
                </div>
                <div className="text-lg uppercase font-medium tracking-wider text-gray-600 dark:text-white">
                  {getStateDescription(timerState)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <CircularProgressbar
              className={"pb-6"}
              maxValue={100}
              minValue={0}
              value={progress}
              text={formatTime(timerData.secondsLeft)}
              styles={buildStyles({
                trailColor: "var(--color-gray-600)",
                pathColor: getProgressColor(currentSession.timerView),
                textColor: "var(--color-foreground)",
                pathTransition:
                  progress === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s",
              })}
              counterClockwise
            />
            <div className={"inline-flex pb-6"}>
              <span className="text-xl uppercase font-extrabold tracking-wider text-gray-600 dark:text-gray-400">
                {getStateDescription(timerState)}
              </span>
            </div>
          </>
        )}
        <TrainingTimerInfoContainer />
      </div>
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
    </div>
  );
};

export default TrainingTimer;
