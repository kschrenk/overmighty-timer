import React, { useEffect, useState } from "react";
import { useTraining } from "../context/TrainingContext/TrainingContext";
import { TimerState } from "../types/training";
import { formatTime, getStateDescription } from "../utils/timerUtils";
import { Play, StopCircle, PauseCircle, PlayCircle } from "lucide-react";
import Button from "./Button";

const TrainingTimer: React.FC = () => {
  const { state, dispatch } = useTraining();
  const { timerData } = state;

  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [progress, setProgress] = useState(100);

  const currentSession = timerData.currentSession;
  const currentSet = currentSession?.sets[timerData.currentSetIndex];

  // Effect 1: Update totalTime when timer state or set changes
  useEffect(() => {
    if (!currentSet) return;

    switch (timerData.timerState) {
      case TimerState.HANGING:
        setCurrentTime(currentSet.hangTime);
        break;
      case TimerState.RESTING_BETWEEN_REPS:
        setCurrentTime(currentSet.rest);
        break;
      case TimerState.RESTING_AFTER_SET:
        setCurrentTime(currentSet.restAfter);
        break;
      // Do NOT set totalTime to null for other states (e.g., PAUSED)
      default:
        // Do nothing, keep previous totalTime
        break;
    }
  }, [timerData.timerState, currentSet]);

  // Effect 2: Update progress only when secondsLeft changes
  useEffect(() => {
    if (currentTime && currentTime > 0) {
      const rawProgress =
        ((currentTime - timerData.secondsLeft) * 100) / currentTime;
      setProgress(Math.max(0, Math.min(100, rawProgress)));
    }
  }, [timerData.secondsLeft, currentTime]);

  const handleStart = () => {
    if (currentSession) {
      dispatch({ type: "START_SESSION", payload: currentSession });
    }
  };

  const handleStop = () => {
    if (window.confirm("Are you sure you want to stop the timer?")) {
      dispatch({ type: "RESET_TIMER" });
      dispatch({ type: "GO_TO_HOME" });
    }
  };

  const handlePause = () => {
    dispatch({ type: "PAUSE_TIMER", payload: timerData.timerState });
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

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    switch (timerData.timerState) {
      case TimerState.HANGING:
        return "stroke-green-600";
      case TimerState.RESTING_BETWEEN_REPS:
      case TimerState.RESTING_AFTER_SET:
        return "stroke-red-600";
      default:
        return "stroke-gray-300";
    }
  };

  const isIdle = timerData.timerState === TimerState.IDLE;
  const isFinished = timerData.timerState === TimerState.FINISHED;
  const isPaused = timerData.timerState === TimerState.PAUSED;
  const isRunning = !isIdle && !isFinished && !isPaused;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="grow flex flex-col items-center justify-center py-8">
        <div className="relative w-64 h-64 mb-6">
          <svg className="w-full h-full" viewBox="0 0 128 128">
            <circle
              cx={64}
              cy={64}
              r={radius}
              strokeWidth={10}
              className="stroke-gray-300 dark:stroke-gray-700"
              fill="transparent"
            />
            <circle
              cx={64}
              cy={64}
              r={radius}
              strokeWidth={10}
              fill="transparent"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-200 ${getProgressColor()}`}
              style={{
                transform: "rotate(-90deg) scale(1, -1)",
                transformOrigin: "center",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              {formatTime(timerData.secondsLeft)}
            </div>
            <div className="text-sm uppercase font-medium tracking-wider text-gray-600 dark:text-gray-400">
              {getStateDescription(timerData.timerState)}
            </div>
          </div>
        </div>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            {currentSet.gripType}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Rep {timerData.currentRepetition + 1} / {currentSet.repetitions}
            {currentSet.additionalWeight > 0 && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                +{currentSet.additionalWeight}kg
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set {timerData.currentSetIndex + 1} of {currentSession.sets.length}
          </p>
        </div>
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
            className="p-5 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            aria-label="Pause timer"
          >
            <PauseCircle size={36} className="mr-2" />
            Pause
          </Button>
        )}
        {isPaused && (
          <Button
            onClick={handleResume}
            className="p-5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            aria-label="Resume timer"
          >
            <PlayCircle size={36} className="mr-2" />
            Resume
          </Button>
        )}
        {!isIdle && !isFinished && (
          <Button
            onClick={handleStop}
            className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
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
