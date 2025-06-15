import React, { useEffect, useState } from "react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { TimerState, TimerViewEnum } from "@/types/training";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TrainingTimerInfoContainer } from "@/components/TrainingTimerInfo";
import { useWakeLock } from "@/hooks/useWakeLock";
import { TrainingTimerProgressIndicatorContainer } from "@/components/TrainingTimerProgressIndicator";
import { TrainingTimerControls } from "@/components/TrainingTimerControls";

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

  const isIdle = timerState === TimerState.IDLE;
  const isFinished = timerState === TimerState.FINISHED;
  const isPaused = timerState === TimerState.PAUSED;
  const isRunning = !isIdle && !isFinished && !isPaused;
  const isTimerViewBar = currentSession.timerView === TimerViewEnum.BAR;

  return (
    <div
      className={`max-w-md mx-auto py-4 flex flex-col min-h-[calc(100vh-4rem)] ${!isTimerViewBar ? "px-6" : "px-0"}`}
    >
      <TrainingTimerProgressIndicatorContainer progress={progress} />
      <TrainingTimerInfoContainer />
      <TrainingTimerControls
        isIdle={isIdle}
        isFinished={isFinished}
        isRunning={isRunning}
        isPaused={isPaused}
        handleStart={handleStart}
        handlePause={handlePause}
        handleResume={handleResume}
        handleStop={handleStop}
      />
    </div>
  );
};

export default TrainingTimer;
