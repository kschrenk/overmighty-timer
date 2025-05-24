import {
  TimerData,
  TimerState,
  TimerViewEnum,
  TrainingSession,
} from "@/types/training";

export const initialTimerData: TimerData = {
  currentSession: null,
  currentSetIndex: 0,
  currentRepetition: 0,
  currentSetRepetition: 0,
  timerState: TimerState.IDLE,
  secondsLeft: 0,
};

export const DEFAULT_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: "1",
    name: "Beginner Hangboard",
    timerView: TimerViewEnum.CIRCLE,
    sets: [
      {
        id: "1-1",
        gripType: "Jug",
        hangTime: 7,
        rest: 3,
        repetitions: 6,
        restAfter: 180,
        additionalWeight: 0,
      },
      {
        id: "1-2",
        gripType: "Half Crimp",
        hangTime: 10,
        rest: 3,
        repetitions: 3,
        restAfter: 60,
        additionalWeight: 0,
      },
    ],
  },
  {
    id: "2",
    name: "Intermediate Training",
    timerView: TimerViewEnum.BAR,
    sets: [
      {
        id: "2-1",
        gripType: "Half Crimp",
        hangTime: 10,
        rest: 3,
        repetitions: 5,
        restAfter: 90,
        additionalWeight: 5,
      },
      {
        id: "2-2",
        gripType: "Open Hand",
        hangTime: 7,
        rest: 3,
        repetitions: 5,
        restAfter: 90,
        additionalWeight: 5,
      },
      {
        id: "2-3",
        gripType: "Three Finger Pocket",
        hangTime: 7,
        rest: 3,
        repetitions: 4,
        restAfter: 90,
        additionalWeight: 0,
      },
    ],
  },
];
