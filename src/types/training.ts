export interface Set {
  id: string;
  gripType: string;
  hangTime: number; // in seconds
  repetitions: number;
  restAfter: number; // in seconds
  additionalWeight: number; // in kg
}

export interface TrainingSession {
  id: string;
  name: string;
  sets: Set[];
}

export enum TimerState {
  IDLE = 'idle',
  HANGING = 'hanging',
  RESTING_BETWEEN_REPS = 'restingBetweenReps',
  RESTING_AFTER_SET = 'restingAfterSet',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

export interface TimerData {
  currentSession: TrainingSession | null;
  currentSetIndex: number;
  currentRepetition: number;
  timerState: TimerState;
  secondsLeft: number;
}