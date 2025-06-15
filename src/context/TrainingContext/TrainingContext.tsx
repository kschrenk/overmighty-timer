import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import type { TrainingSession, TimerData } from "@/types/training";
import { TimerState } from "@/types/training";
import {
  playLastThreeSecondsSound,
  playStateChangeSound,
} from "@/utils/soundUtils";
import type { TrainingAction } from "@/lib/trainingReducer";
import { trainingReducer } from "@/lib/trainingReducer";
import { useAuth } from "@/context/AuthContext";

import { fetchTrainingSessions } from "@/lib/firestoreUtils";
import { isUidTestUser } from "@/lib/testUser";
import {
  DEFAULT_TRAINING_SESSIONS,
  initialTimerData,
} from "@/data/defaultData";

export interface TrainingContextState {
  trainingSessions: TrainingSession[];
  timerData: TimerData;
  activeView: "list" | "timer" | "editor" | "account" | "register";
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
  getSessionById?: (sessionId: string) => TrainingSession | undefined;
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
  const [loading, setLoading] = useState<boolean>(false);

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

    if (isUidTestUser(currentUser.uid)) {
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
      state.timerData.timerState === TimerState.RESTING_AFTER_SET ||
      state.timerData.timerState === TimerState.PREPARATION
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
  }, [state.timerData.timerState, timerId]);

  // play sound for timer state change
  useEffect(() => {
    playStateChangeSound(state.timerData.timerState);
  }, [state.timerData.timerState]);

  // play sound for last three seconds of a hang
  useEffect(() => {
    const { currentSession, timerState, secondsLeft } = state.timerData;

    if (currentSession && timerState === TimerState.HANGING) {
      if (secondsLeft < 3) {
        return playLastThreeSecondsSound();
      }
    }
  }, [state.timerData]);

  // helper
  function getSessionById(sessionId: string) {
    return state.trainingSessions.find((s) => s.id === sessionId);
  }

  return (
    <TrainingContext.Provider
      value={{ state, dispatch, loading, getSessionById }}
    >
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
