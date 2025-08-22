export interface Set {
  id: string;
  gripType: string;
  hangTime: number; // in seconds
  rest: number; // rest between reps, in seconds
  repetitions: number;
  restAfter: number; // in seconds
  additionalWeight: number; // in kg
}

export enum TimerViewEnum {
  CIRCLE = "circle",
}

export interface TrainingSession {
  id: string;
  name: string;
  sets: Set[];
  timerView?: TimerViewEnum;
  preparationTime?: number; // in seconds
}

export enum TimerState {
  IDLE = "idle",
  HANGING = "hanging",
  RESTING_BETWEEN_REPS = "restingBetweenReps",
  RESTING_AFTER_SET = "restingAfterSet",
  PAUSED = "paused",
  FINISHED = "finished",
  PREPARATION = "preparation",
}

export interface TimerData {
  currentSession: TrainingSession | null;
  currentSetIndex: number;
  currentRepetition: number;
  timerState: TimerState;
  secondsLeft: number;
  previousTimerState?: TimerState;
}
