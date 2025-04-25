import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Set, TrainingSession, TimerState, TimerData } from '../types/training';
import { playStateChangeSound } from '../utils/soundUtils';
import { generateId } from '../utils/timerUtils';

const DEFAULT_REST_BETWEEN_REPS = 5;

const DEFAULT_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: '1',
    name: 'Beginner Hangboard',
    sets: [
      {
        id: '1-1',
        gripType: 'Jug',
        hangTime: 10,
        repetitions: 3,
        restAfter: 60,
        additionalWeight: 0
      },
      {
        id: '1-2',
        gripType: 'Half Crimp',
        hangTime: 7,
        repetitions: 3,
        restAfter: 60,
        additionalWeight: 0
      }
    ]
  },
  {
    id: '2',
    name: 'Intermediate Training',
    sets: [
      {
        id: '2-1',
        gripType: 'Half Crimp',
        hangTime: 10,
        repetitions: 5,
        restAfter: 90,
        additionalWeight: 5
      },
      {
        id: '2-2',
        gripType: 'Open Hand',
        hangTime: 7,
        repetitions: 5,
        restAfter: 90,
        additionalWeight: 5
      },
      {
        id: '2-3',
        gripType: 'Three Finger Pocket',
        hangTime: 7,
        repetitions: 4,
        restAfter: 90,
        additionalWeight: 0
      }
    ]
  }
];

const initialTimerData: TimerData = {
  currentSession: null,
  currentSetIndex: 0,
  currentRepetition: 0,
  timerState: TimerState.IDLE,
  secondsLeft: 0
};

interface TrainingContextState {
  trainingSessions: TrainingSession[];
  timerData: TimerData;
  activeView: 'list' | 'timer' | 'editor';
  editingSession: TrainingSession | null;
}

const initialState: TrainingContextState = {
  trainingSessions: DEFAULT_TRAINING_SESSIONS,
  timerData: initialTimerData,
  activeView: 'list',
  editingSession: null
};

type TrainingAction =
  | { type: 'START_SESSION'; payload: TrainingSession }
  | { type: 'TICK' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'GO_TO_HOME' }
  | { type: 'CREATE_SESSION' }
  | { type: 'EDIT_SESSION'; payload: TrainingSession }
  | { type: 'SAVE_SESSION'; payload: TrainingSession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_SET'; payload: Set }
  | { type: 'UPDATE_SET'; payload: Set }
  | { type: 'DELETE_SET'; payload: string }
  | { type: 'DUPLICATE_SET'; payload: string };

const trainingReducer = (state: TrainingContextState, action: TrainingAction): TrainingContextState => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        timerData: {
          currentSession: action.payload,
          currentSetIndex: 0,
          currentRepetition: 0,
          timerState: TimerState.HANGING,
          secondsLeft: action.payload.sets[0].hangTime
        },
        activeView: 'timer'
      };

    case 'TICK':
      if (state.timerData.secondsLeft > 1) {
        return {
          ...state,
          timerData: {
            ...state.timerData,
            secondsLeft: state.timerData.secondsLeft - 1
          }
        };
      }

      const { currentSession, currentSetIndex, currentRepetition, timerState } = state.timerData;
      
      if (!currentSession) return state;
      
      const currentSet = currentSession.sets[currentSetIndex];
      
      if (timerState === TimerState.HANGING) {
        if (currentRepetition < currentSet.repetitions - 1) {
          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentRepetition: currentRepetition + 1,
              timerState: TimerState.RESTING_BETWEEN_REPS,
              secondsLeft: DEFAULT_REST_BETWEEN_REPS
            }
          };
        } else {
          if (currentSetIndex < currentSession.sets.length - 1) {
            return {
              ...state,
              timerData: {
                ...state.timerData,
                timerState: TimerState.RESTING_AFTER_SET,
                secondsLeft: currentSet.restAfter
              }
            };
          } else {
            return {
              ...state,
              timerData: {
                ...state.timerData,
                timerState: TimerState.FINISHED,
                secondsLeft: 0
              }
            };
          }
        }
      } else if (timerState === TimerState.RESTING_BETWEEN_REPS) {
        return {
          ...state,
          timerData: {
            ...state.timerData,
            timerState: TimerState.HANGING,
            secondsLeft: currentSet.hangTime
          }
        };
      } else if (timerState === TimerState.RESTING_AFTER_SET) {
        const nextSetIndex = currentSetIndex + 1;
        if (nextSetIndex < currentSession.sets.length) {
          return {
            ...state,
            timerData: {
              ...state.timerData,
              currentSetIndex: nextSetIndex,
              currentRepetition: 0,
              timerState: TimerState.HANGING,
              secondsLeft: currentSession.sets[nextSetIndex].hangTime
            }
          };
        } else {
          return {
            ...state,
            timerData: {
              ...state.timerData,
              timerState: TimerState.FINISHED,
              secondsLeft: 0
            }
          };
        }
      }
      
      return state;

    case 'PAUSE_TIMER':
      return {
        ...state,
        timerData: {
          ...state.timerData,
          timerState: TimerState.PAUSED
        }
      };

    case 'RESUME_TIMER':
      const previousState = state.timerData.timerState === TimerState.PAUSED
        ? (state.timerData.currentRepetition === 0 && state.timerData.secondsLeft === state.timerData.currentSession?.sets[state.timerData.currentSetIndex].hangTime
            ? TimerState.HANGING
            : state.timerData.currentRepetition < (state.timerData.currentSession?.sets[state.timerData.currentSetIndex].repetitions || 0)
              ? TimerState.RESTING_BETWEEN_REPS
              : TimerState.RESTING_AFTER_SET)
        : state.timerData.timerState;
        
      return {
        ...state,
        timerData: {
          ...state.timerData,
          timerState: previousState
        }
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timerData: initialTimerData
      };

    case 'GO_TO_HOME':
      return {
        ...state,
        activeView: 'list',
        timerData: initialTimerData,
        editingSession: null
      };

    case 'CREATE_SESSION':
      const newSession: TrainingSession = {
        id: generateId(),
        name: 'New Training Session',
        sets: [
          {
            id: generateId(),
            gripType: 'Jug',
            hangTime: 10,
            repetitions: 3,
            restAfter: 60,
            additionalWeight: 0
          }
        ]
      };
      
      return {
        ...state,
        editingSession: newSession,
        activeView: 'editor'
      };

    case 'EDIT_SESSION':
      return {
        ...state,
        editingSession: action.payload,
        activeView: 'editor'
      };

    case 'SAVE_SESSION': {
        const existingIndex = state.trainingSessions.findIndex(s => s.id === action.payload.id);

      if (existingIndex >= 0) {
        const updatedSessions = [...state.trainingSessions];
        updatedSessions[existingIndex] = action.payload;

        return {
          ...state,
          trainingSessions: updatedSessions,
          activeView: 'list',
          editingSession: null
        };
      } else {
        return {
          ...state,
          trainingSessions: [...state.trainingSessions, action.payload],
          activeView: 'list',
          editingSession: null
        };
      }
    }

    case 'DELETE_SESSION':
      return {
        ...state,
        trainingSessions: state.trainingSessions.filter(s => s.id !== action.payload),
        activeView: 'list',
        editingSession: null
      };

    case 'ADD_SET':
      if (!state.editingSession) return state;
      
      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: [...state.editingSession.sets, action.payload]
        }
      };

    case 'UPDATE_SET':
      if (!state.editingSession) return state;
      
      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: state.editingSession.sets.map(s => 
            s.id === action.payload.id ? action.payload : s
          )
        }
      };

    case 'DELETE_SET':
      if (!state.editingSession) return state;
      
      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: state.editingSession.sets.filter(s => s.id !== action.payload)
        }
      };

    case 'DUPLICATE_SET': {
      if (!state.editingSession) {
        return state
      };

      const setToDuplicate = state.editingSession.sets.find(s => s.id === action.payload);
      if (!setToDuplicate) {
        return state
      };

      const duplicatedSet: Set = {
        ...setToDuplicate,
        id: generateId()
      };

      return {
        ...state,
        editingSession: {
          ...state.editingSession,
          sets: [...state.editingSession.sets, duplicatedSet]
        }
      };
      }

    default:
      return state;
  }
};

export const TrainingContext = createContext<{
  state: TrainingContextState;
  dispatch: React.Dispatch<TrainingAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(trainingReducer, initialState);
  const [timerId, setTimerId] = useState<number | null>(null);

  useEffect(() => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      setTimerId(null);
    }

    if (
      state.timerData.timerState === TimerState.HANGING ||
      state.timerData.timerState === TimerState.RESTING_BETWEEN_REPS ||
      state.timerData.timerState === TimerState.RESTING_AFTER_SET
    ) {
      const id = window.setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      
      setTimerId(id);
    }

    return () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
      }
    };
  }, [state.timerData.timerState]);

  useEffect(() => {
    playStateChangeSound(state.timerData.timerState);
  }, [state.timerData.timerState]);

  return (
    <TrainingContext.Provider value={{ state, dispatch }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => useContext(TrainingContext);