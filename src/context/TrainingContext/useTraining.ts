import type React from "react";
import { createContext, useContext } from "react";
import type { TrainingContextState } from "@/context/TrainingContext/TrainingContext";
import type { TrainingAction } from "@/lib/trainingReducer";
import type { TrainingSession } from "@/types/training";
import { initialTimerData } from "@/data/defaultData";

export const initialState: TrainingContextState = {
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

export const useTraining = () => {
  const context = useContext(TrainingContext);

  if (!context) {
    throw new Error(`useTraining() must be used within the context`);
  }

  return context;
};
