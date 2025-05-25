import { TrainingContextState } from "@/context/TrainingContext/TrainingContext";
import { Set, TimerState, TrainingSession } from "@/types/training";
import { generateId } from "@/utils/timerUtils";
import { initialTimerData } from "@/data/defaultData";

export type TrainingAction =
  | { type: "START_SESSION"; payload: TrainingSession }
  | { type: "TICK" }
  | { type: "PAUSE_TIMER"; payload: TimerState }
  | { type: "RESUME_TIMER" }
  | { type: "RESET_TIMER" }
  | { type: "GO_TO_HOME" }
  | { type: "GO_TO_ACCOUNT" }
  | { type: "CREATE_SESSION" }
  | { type: "SET_SESSIONS"; payload: TrainingSession[] }
  | { type: "EDIT_SESSION"; payload: TrainingSession }
  | { type: "SAVE_SESSION"; payload: TrainingSession }
  | { type: "DELETE_SESSION"; payload: string }
  | { type: "ADD_SET"; payload: Set }
  | { type: "UPDATE_SET"; payload: Set }
  | { type: "DELETE_SET"; payload: string }
  | { type: "DUPLICATE_SET"; payload: string };

export const trainingReducer = (
  state: TrainingContextState,
  action: TrainingAction,
): TrainingContextState => {
  switch (action.type) {
    case "START_SESSION":
      return {
        ...state,
        timerData: {
          currentSession: action.payload,
          currentSetIndex: 0,
          currentRepetition: 0,
          currentSetRepetition: 0,
          timerState: TimerState.HANGING,
          secondsLeft: action.payload.sets[0].hangTime,
        },
        activeView: "timer",
      };

    case "TICK": {
      if (state.timerData.secondsLeft > 0) {
        return {
          ...state,
          timerData: {
            ...state.timerData,
            secondsLeft: state.timerData.secondsLeft - 1,
          },
        };
      }

      const {
        currentSession,
        currentSetIndex,
        currentRepetition,
        currentSetRepetition = 0,
        timerState,
      } = state.timerData;
      if (!currentSession) return state;

      const currentSet = currentSession.sets[currentSetIndex];
      const setRepetitions = currentSet.setRepetitions ?? 1;

      if (timerState === TimerState.HANGING) {
        if (currentRepetition < currentSet.repetitions - 1) {
          // Next rep in this set repetition
          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentRepetition: currentRepetition + 1,
              timerState: TimerState.RESTING_BETWEEN_REPS,
              secondsLeft: currentSet.rest,
            },
          };
        }
        // Finished all reps in this set repetition
        if (currentSetRepetition < setRepetitions - 1) {
          // Repeat the set
          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentRepetition: 0,
              currentSetRepetition: currentSetRepetition + 1,
              timerState: TimerState.RESTING_AFTER_SET,
              secondsLeft: currentSet.restAfter,
            },
          };
        }

        if (currentSetIndex < currentSession.sets.length - 1) {
          // Move to next set
          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentSetIndex: currentSetIndex + 1,
              currentRepetition: 0,
              currentSetRepetition: 0,
              timerState: TimerState.RESTING_AFTER_SET,
              secondsLeft: currentSession.sets[currentSetIndex + 1].restAfter,
            },
          };
        }

        // Finished all sets
        return {
          ...state,
          timerData: {
            ...state.timerData,
            timerState: TimerState.FINISHED,
            secondsLeft: 0,
          },
        };
      }

      if (timerState === TimerState.RESTING_BETWEEN_REPS) {
        return {
          ...state,
          timerData: {
            ...state.timerData,
            timerState: TimerState.HANGING,
            secondsLeft: currentSet.hangTime,
          },
        };
      }

      if (timerState === TimerState.RESTING_AFTER_SET) {
        // After rest, either repeat set or move to next set
        if (currentSetRepetition < setRepetitions && currentRepetition === 0) {
          // Start next set repetition
          return {
            ...state,
            timerData: {
              ...state.timerData,
              timerState: TimerState.HANGING,
              secondsLeft: currentSet.hangTime,
            },
          };
        }

        if (currentSetIndex < currentSession.sets.length - 1) {
          // Move to next set
          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentSetIndex: currentSetIndex + 1,
              currentRepetition: 0,
              currentSetRepetition: 0,
              timerState: TimerState.HANGING,
              secondsLeft: currentSession.sets[currentSetIndex + 1].hangTime,
            },
          };
        }

        // Finished all sets
        return {
          ...state,
          timerData: {
            ...state.timerData,
            timerState: TimerState.FINISHED,
            secondsLeft: 0,
          },
        };
      }

      return state;
    }

    case "PAUSE_TIMER":
      return {
        ...state,
        timerData: {
          ...state.timerData,
          timerState: TimerState.PAUSED,
          previousTimerState: action.payload,
        },
      };

    case "RESUME_TIMER": {
      const previousState = state.timerData.previousTimerState;

      return {
        ...state,
        timerData: {
          ...state.timerData,
          timerState: previousState ?? state.timerData.timerState,
        },
      };
    }

    case "RESET_TIMER":
      return {
        ...state,
        timerData: initialTimerData,
      };

    case "GO_TO_HOME":
      return {
        ...state,
        activeView: "list",
        timerData: initialTimerData,
        editingSession: null,
      };

    case "GO_TO_ACCOUNT":
      return {
        ...state,
        activeView: "account",
        timerData: initialTimerData,
        editingSession: null,
      };

    case "SET_SESSIONS": {
      return { ...state, trainingSessions: action.payload };
    }

    case "CREATE_SESSION": {
      const newSession: TrainingSession = {
        id: generateId(),
        name: "New Training Session",
        sets: [
          {
            id: generateId(),
            gripType: "Jug",
            hangTime: 10,
            rest: 3,
            repetitions: 3,
            restAfter: 60,
            additionalWeight: 0,
          },
        ],
      };

      return {
        ...state,
        editingSession: newSession,
        activeView: "editor",
      };
    }

    case "EDIT_SESSION": {
      return {
        ...state,
        editingSession: action.payload,
        activeView: "editor",
      };
    }

    case "SAVE_SESSION": {
      const existingIndex = state.trainingSessions.findIndex(
        (s) => s.id === action.payload.id,
      );

      if (existingIndex >= 0) {
        const updatedSessions = [...state.trainingSessions];
        updatedSessions[existingIndex] = action.payload;

        return {
          ...state,
          trainingSessions: updatedSessions,
          activeView: "list",
          editingSession: null,
        };
      } else {
        return {
          ...state,
          trainingSessions: [...state.trainingSessions, action.payload],
          activeView: "list",
          editingSession: null,
        };
      }
    }

    case "DELETE_SESSION": {
      return {
        ...state,
        trainingSessions: state.trainingSessions.filter(
          (s) => s.id !== action.payload,
        ),
        activeView: "list",
        editingSession: null,
      };
    }

    case "ADD_SET":
      if (!state.editingSession) return state;

      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: [...state.editingSession.sets, action.payload],
        },
      };

    case "UPDATE_SET":
      if (!state.editingSession) return state;

      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: state.editingSession.sets.map((s) =>
            s.id === action.payload.id ? action.payload : s,
          ),
        },
      };

    case "DELETE_SET":
      if (!state.editingSession) return state;

      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: state.editingSession.sets.filter(
            (s) => s.id !== action.payload,
          ),
        },
      };

    case "DUPLICATE_SET": {
      if (!state.editingSession) {
        return state;
      }

      const setToDuplicate = state.editingSession.sets.find(
        (s) => s.id === action.payload,
      );
      if (!setToDuplicate) {
        return state;
      }

      const duplicatedSet: Set = {
        ...setToDuplicate,
        id: generateId(),
      };

      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: [...state.editingSession.sets, duplicatedSet],
        },
      };
    }

    default:
      return state;
  }
};
