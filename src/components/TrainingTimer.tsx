import React, { useEffect, useState } from "react";
import { Pause, Play, SkipForward, StopCircle } from "lucide-react";
import { useTraining } from "../context/TrainingContext";
import { TimerState } from "../types/training";
import { formatTime, getStateDescription } from "../utils/timerUtils";

const TrainingTimer: React.FC = () => {
  const { state, dispatch } = useTraining();
  const { timerData } = state;
  const [progress, setProgress] = useState(100);

  const currentSession = timerData.currentSession;
  const currentSet = currentSession?.sets[timerData.currentSetIndex];

  useEffect(() => {
    if (!currentSet) return;

    let totalTime = 0;

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

    if (totalTime > 0) {
      setProgress((timerData.secondsLeft / totalTime) * 100);
    } else {
      setProgress(0);
    }
  }, [timerData.secondsLeft, timerData.timerState, currentSet]);

  const handlePauseResume = () => {
    if (timerData.timerState === TimerState.PAUSED) {
      dispatch({ type: "RESUME_TIMER" });
    } else {
      dispatch({ type: "PAUSE_TIMER" });
    }
  };

  const handleStop = () => {
    if (confirm("Are you sure you want to stop the timer?")) {
      dispatch({ type: "RESET_TIMER" });
      dispatch({ type: "GO_TO_HOME" });
    }
  };

  const handleSkip = () => {
    dispatch({ type: "TICK" });
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

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    switch (timerData.timerState) {
      case TimerState.HANGING:
        return "stroke-red-600";
      case TimerState.RESTING_BETWEEN_REPS:
      case TimerState.RESTING_AFTER_SET:
        return "stroke-green-600";
      default:
        return "stroke-gray-300";
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-grow flex flex-col items-center justify-center py-8">
        <div className="relative w-64 h-64 mb-6">
          <svg className="w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              strokeWidth="10"
              stroke="gray"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-200 ${getProgressColor()}`}
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
        <button
          onClick={handleStop}
          className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-200 shadow-sm hover:shadow"
          aria-label="Stop timer"
        >
          <StopCircle size={32} />
        </button>

        <button
          onClick={handlePauseResume}
          className={`p-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
            timerData.timerState === TimerState.PAUSED
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
          aria-label={
            timerData.timerState === TimerState.PAUSED ? "Resume" : "Pause"
          }
        >
          {timerData.timerState === TimerState.PAUSED ? (
            <Play size={36} />
          ) : (
            <Pause size={36} />
          )}
        </button>

        <button
          onClick={handleSkip}
          className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-all duration-200 shadow-sm hover:shadow"
          aria-label="Skip to next"
        >
          <SkipForward size={32} />
        </button>
      </div>
    </div>
  );
};

export default TrainingTimer;
