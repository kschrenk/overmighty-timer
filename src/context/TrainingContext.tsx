import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { TrainingSession, TimerState, TimerData } from "../types/training";
import { playStateChangeSound } from "../utils/soundUtils";
import { DEFAULT_TRAINING_SESSIONS } from "../data/defaultTrainingSessions";
import { TrainingAction, trainingReducer } from "../reducers/trainingReducer";

export const initialTimerData: TimerData = {
  currentSession: null,
  currentSetIndex: 0,
  currentRepetition: 0,
  currentSetRepetition: 0,
  timerState: TimerState.IDLE,
  secondsLeft: 0,
};

export interface TrainingContextState {
  trainingSessions: TrainingSession[];
  timerData: TimerData;
  activeView: "list" | "timer" | "editor";
  editingSession: TrainingSession | null;
}

const initialState: TrainingContextState = {
  trainingSessions: DEFAULT_TRAINING_SESSIONS,
  timerData: initialTimerData,
  activeView: "list",
  editingSession: null,
};

export const TrainingContext = createContext<{
  state: TrainingContextState;
  dispatch: React.Dispatch<TrainingAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
        dispatch({ type: "TICK" });
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
