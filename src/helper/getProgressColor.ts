import { TimerState } from "@/types/training";

export const getProgressColor = (timerState: TimerState) => {
  switch (timerState) {
    case TimerState.HANGING:
      return "var(--color-green-700)";
    case TimerState.RESTING_BETWEEN_REPS:
    case TimerState.RESTING_AFTER_SET:
      return "var(--color-red-700)";
    case TimerState.PREPARATION:
      return "var(--color-yellow-600)";
    default:
      return "var(--color-gray-300)";
  }
};
