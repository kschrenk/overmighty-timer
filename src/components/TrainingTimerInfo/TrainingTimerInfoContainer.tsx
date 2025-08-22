import { useTraining } from "@/context/TrainingContext/TrainingContext";
import {
  getCurrentSetFromSession,
  getNextSet,
} from "@/lib/trainingReducer.helper";
import { TimerState } from "@/types/training";
import { TrainingTimerInfo } from "@/components/TrainingTimerInfo/TrainingTimerInfo";
import { TrainingTimerInfoWrapper } from "@/components/TrainingTimerInfo/TrainingTimerInfoWrapper";

export const TrainingTimerInfoContainer = () => {
  const { state } = useTraining();
  const { timerData } = state;
  const { timerState, currentSession, currentSetIndex } = timerData;

  // If there is no current session, we don't show the info
  if (!currentSession) {
    return null;
  }

  const currentSet = getCurrentSetFromSession(currentSession, currentSetIndex);
  const setLength = currentSession.sets.length;
  const nextSet = getNextSet(currentSession, currentSetIndex);
  const nextSetIndex = currentSetIndex + 1;
  const isDisplayNextSetInformation = Boolean(
    nextSet && timerState === TimerState.RESTING_AFTER_SET,
  );
  const gripType = isDisplayNextSetInformation
    ? nextSet?.gripType
    : currentSet.gripType;
  const repetition = isDisplayNextSetInformation
    ? 0
    : timerData.currentRepetition;
  const setIndex = isDisplayNextSetInformation ? nextSetIndex : currentSetIndex;
  const repetitions = isDisplayNextSetInformation
    ? nextSet?.repetitions
    : currentSet.repetitions;
  const additionalWeight = isDisplayNextSetInformation
    ? nextSet?.additionalWeight
    : currentSet.additionalWeight;

  const isPreparation =
    timerState === TimerState.PREPARATION ||
    timerData.previousTimerState === TimerState.PREPARATION;
  const isFinished = timerState === TimerState.FINISHED;

  // If the timer is in preparation or finished state, we don't show the info
  if (isFinished) {
    return null;
  }

  return (
    <TrainingTimerInfoWrapper
      timerState={timerState}
      isDisplayNextSetInformation={isDisplayNextSetInformation}
    >
      {!isPreparation ? (
        <TrainingTimerInfo
          gripType={gripType}
          currentRepetition={repetition}
          repetitions={repetitions}
          currentSetIndex={setIndex}
          setLength={setLength}
          additionalWeight={additionalWeight}
        />
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            🚀 Get Ready!
          </h3>
          <p className="text-2xl text-gray-100 truncate">
            {gripType} / {currentSet.repetitions} Rep
            {currentSet.repetitions > 1 ? "s" : ""}
            {currentSet.additionalWeight > 0 && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                +{additionalWeight}kg
              </span>
            )}
          </p>
          <p className="text-xl text-gray-100">
            Set {nextSetIndex} of {setLength}
          </p>
        </>
      )}
    </TrainingTimerInfoWrapper>
  );
};
