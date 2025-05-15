import React, { useEffect, useState } from "react";
import { useTraining } from "../context/TrainingContext";
import { TimerState } from "../types/training";
import { formatTime, getStateDescription } from "../utils/timerUtils";
import { Play, StopCircle, PauseCircle, PlayCircle } from "lucide-react";

const TrainingTimer: React.FC = () => {
  const { state, dispatch } = useTraining();
  const { timerData } = state;

  const [progress, setProgress] = useState(100);

  const currentSession = timerData.currentSession;
  const currentSet = currentSession?.sets[timerData.currentSetIndex];

  useEffect(() => {
    if (!currentSet) return;

    let totalTime: number;

    switch (timerData.timerState) {
      case TimerState.HANGING:
        totalTime = currentSet.hangTime;
        break;
      case TimerState.RESTING_BETWEEN_REPS:
        totalTime = 5;
        break;
      case TimerState.RESTING_AFTER_SET:
        totalTime = currentSet.restAfter;
        break;
      default:
        totalTime = 0;
    }

    if (timerData.secondsLeft > 0 && totalTime > 0) {
      setProgress(((totalTime - timerData.secondsLeft) * 100) / totalTime);
    } else {
      setProgress(100);
    }

    return () => setProgress(0);
  }, [timerData.secondsLeft, timerData.timerState, currentSet]);

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
    dispatch({ type: "PAUSE_TIMER" });
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
        <button
          onClick={() => dispatch({ type: "GO_TO_HOME" })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          Go to Home
        </button>
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
      <div className="flex-grow flex flex-col items-center justify-center py-8">
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
          <button
            onClick={handleStart}
            className="p-5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            aria-label="Start timer"
          >
            <Play size={36} className="mr-2" />
            Start
          </button>
        )}
        {isRunning && (
          <button
            onClick={handlePause}
            className="p-5 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            aria-label="Pause timer"
          >
            <PauseCircle size={36} className="mr-2" />
            Pause
          </button>
        )}
        {isPaused && (
          <button
            onClick={handleResume}
            className="p-5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            aria-label="Resume timer"
          >
            <PlayCircle size={36} className="mr-2" />
            Resume
          </button>
        )}
        {!isIdle && !isFinished && (
          <button
            onClick={handleStop}
            className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            aria-label="Stop timer"
          >
            <StopCircle size={36} className="mr-2" />
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainingTimer;
