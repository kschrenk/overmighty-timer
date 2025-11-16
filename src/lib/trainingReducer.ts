import type { TrainingContextState } from "@/context/TrainingContext/TrainingContext";
import type { Set, TrainingSession } from "@/types/training";
import { TimerState } from "@/types/training";
import { generateId } from "@/utils/timerUtils";
import { initialTimerData } from "@/data/defaultData";
import {
  getCurrentSetFromSession,
  getHangTimeFromNextSet,
  hasNextRepetition,
  hasNextSet,
  hasRestAfterSet,
} from "@/lib/trainingReducer.helper";

export type TrainingAction =
  | { type: "START_SESSION"; payload: TrainingSession }
  | { type: "TICK" }
  | { type: "PAUSE_TIMER"; payload: TimerState }
  | { type: "RESUME_TIMER" }
  | { type: "RESET_TIMER" }
  | { type: "GO_TO_HOME" }
  | { type: "GO_TO_ACCOUNT" }
  | { type: "GO_TO_REGISTER" }
  | { type: "CREATE_SESSION" }
  | { type: "SET_SESSIONS"; payload: TrainingSession[] }
  | { type: "EDIT_SESSION"; payload: TrainingSession }
  | { type: "SAVE_SESSION"; payload: TrainingSession }
  | { type: "DELETE_SESSION"; payload: string }
  | { type: "ADD_SET"; payload: Set }
  | { type: "UPDATE_SET"; payload: Set }
  | { type: "DELETE_SET"; payload: string }
  | { type: "DUPLICATE_SET"; payload: string }
  | { type: "UPDATE_SESSION"; payload: TrainingSession }; // <--- added

export const trainingReducer = (
  state: TrainingContextState,
  action: TrainingAction,
): TrainingContextState => {
  switch (action.type) {
    case "START_SESSION": {
      const { payload } = action;
      const timerState =
        payload.preparationTime && payload.preparationTime > 0
          ? TimerState.PREPARATION
          : TimerState.HANGING;
      const secondsLeft =
        (timerState === TimerState.PREPARATION
          ? payload.preparationTime
          : payload.sets[0].hangTime) ?? 0;

      return {
        ...state,
        timerData: {
          currentSession: action.payload,
          currentSetIndex: 0,
          currentRepetition: 0,
          timerState,
          secondsLeft,
        },
        activeView: "timer",
      };
    }

    case "TICK": {
      const newSecondsLeft = state.timerData.secondsLeft - 1;

      if (newSecondsLeft > 0) {
        return {
          ...state,
          timerData: {
            ...state.timerData,
            secondsLeft: newSecondsLeft,
          },
        };
      }

      const { currentSession, currentSetIndex, currentRepetition, timerState } =
        state.timerData;

      if (!currentSession) return state;

      const currentSet = getCurrentSetFromSession(
        currentSession,
        currentSetIndex,
      );

      if (timerState === TimerState.PREPARATION) {
        return {
          ...state,
          timerData: {
            ...state.timerData,
            timerState: TimerState.HANGING,
            secondsLeft: currentSet.hangTime,
          },
        };
      }

      if (timerState === TimerState.HANGING) {
        if (hasNextRepetition(currentRepetition, currentSet)) {
          // Next rep in this set repetition
          return {
            ...state,
            timerData: {
              ...state.timerData,
              timerState: TimerState.RESTING_BETWEEN_REPS,
              secondsLeft: currentSet.rest,
            },
          };
        }

        if (hasRestAfterSet(currentSession, currentSetIndex)) {
          // Move to next set with rest after
          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentSetIndex: currentSetIndex,
              timerState: TimerState.RESTING_AFTER_SET,
              secondsLeft: getCurrentSetFromSession(
                currentSession,
                currentSetIndex,
              ).restAfter,
            },
          };
        }

        if (hasNextSet(currentSetIndex, currentSession)) {
          // Move to next set
          const nextSetIndex = currentSetIndex + 1;

          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentSetIndex: nextSetIndex,
              currentRepetition: 0,
              timerState: TimerState.HANGING,
              secondsLeft: currentSession.sets[nextSetIndex].hangTime,
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
            currentRepetition: currentRepetition + 1,
            timerState: TimerState.HANGING,
            secondsLeft: currentSet.hangTime,
          },
        };
      }

      if (
        timerState === TimerState.RESTING_AFTER_SET &&
        hasNextSet(currentSetIndex, currentSession)
      ) {
        // After rest move to next set
        return {
          ...state,
          timerData: {
            ...state.timerData,
            currentSetIndex: currentSetIndex + 1,
            currentRepetition: 0,
            timerState: TimerState.HANGING,
            secondsLeft: getHangTimeFromNextSet(
              currentSession,
              currentSetIndex,
            ),
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

    case "PAUSE_TIMER": {
      return {
        ...state,
        timerData: {
          ...state.timerData,
          timerState: TimerState.PAUSED,
          previousTimerState: action.payload,
        },
      };
    }

    case "RESUME_TIMER": {
      const previousState = state.timerData.previousTimerState;

      return {
        ...state,
        timerData: {
          ...state.timerData,
          timerState: previousState ?? state.timerData.timerState,
          previousTimerState: undefined,
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

    case "GO_TO_REGISTER":
      return {
        ...state,
        activeView: "register",
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

    case "UPDATE_SESSION": {
      if (!state.editingSession) return state;

      // Only update the in-progress editingSession; do not touch saved list yet
      // (that happens on SAVE_SESSION). Ensure IDs match to avoid accidental overwrite.
      if (state.editingSession.id !== action.payload.id) {
        return state;
      }

      return {
        ...state,
        editingSession: action.payload,
        // keep activeView as editor
        activeView: "editor",
      };
    }

    default:
      return state;
  }
};
