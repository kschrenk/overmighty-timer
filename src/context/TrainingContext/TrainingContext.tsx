import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { TrainingSession, TimerState, TimerData } from "@/types/training";
import { playStateChangeSound } from "@/utils/soundUtils";
import { TrainingAction, trainingReducer } from "@/reducers/trainingReducer";
import { useAuth } from "@/context/AuthContext";

import { DEFAULT_TRAINING_SESSIONS } from "@/data/defaultTrainingSessions";
import { fetchTrainingSessions } from "@/lib/firestoreUtils";

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
  trainingSessions: [],
  timerData: initialTimerData,
  activeView: "list",
  editingSession: null,
};

export const TrainingContext = createContext<{
  state: TrainingContextState;
  dispatch: React.Dispatch<TrainingAction>;
  loading: boolean;
}>({
  state: initialState,
  dispatch: () => null,
  loading: false,
});

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();

  const [state, dispatch] = useReducer(trainingReducer, initialState);
  const [timerId, setTimerId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // load training sessions from firestore
  useEffect(() => {
    if (!currentUser) return;

    const loadTrainingSessions = async () => {
      try {
        setLoading(true);
        const sessions = await fetchTrainingSessions(currentUser.uid);
        if (sessions) {
          dispatch({ type: "SET_SESSIONS", payload: sessions });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.uid === "test-user") {
      dispatch({
        type: "SET_SESSIONS",
        payload: DEFAULT_TRAINING_SESSIONS,
      });
      return;
    }

    loadTrainingSessions();
  }, [currentUser]);

  // set interval for timer
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

  // play sound
  useEffect(() => {
    playStateChangeSound(state.timerData.timerState);
  }, [state.timerData.timerState]);

  return (
    <TrainingContext.Provider value={{ state, dispatch, loading }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => {
  const context = useContext(TrainingContext);

  if (!context) {
    throw new Error(`useTraining() must be used within the context`);
  }

  return context;
};
