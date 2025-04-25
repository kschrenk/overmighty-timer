import { TimerState } from '../types/training';

// Calculate total duration of a training session in seconds
export const calculateTotalDuration = (
  hangTime: number,
  repetitions: number,
  restBetweenReps: number, // Default rest between repetitions
  restAfterSet: number
): number => {
  // Time for all hangs and rests between repetitions
  const singleSetDuration = (hangTime * repetitions) + (restBetweenReps * (repetitions - 1));
  // Add rest after set
  return singleSetDuration + restAfterSet;
};

// Format seconds to MM:SS display
export const formatTime = (seconds: number): string => {
  if (seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Get state description based on timer state
export const getStateDescription = (state: TimerState): string => {
  switch (state) {
    case TimerState.HANGING:
      return 'HANG';
    case TimerState.RESTING_BETWEEN_REPS:
      return 'REST';
    case TimerState.RESTING_AFTER_SET:
      return 'SET REST';
    case TimerState.PAUSED:
      return 'PAUSED';
    case TimerState.FINISHED:
      return 'FINISHED';
    default:
      return 'READY';
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};