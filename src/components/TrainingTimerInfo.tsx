import type { FC, ReactNode } from "react";
import { TimerState, TimerViewEnum } from "@/types/training";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import {
  getCurrentSetFromSession,
  getNextSet,
} from "@/lib/trainingReducer.helper";

type TrainingTimerInfoProps = {
  gripType?: string;
  currentRepetition: number;
  currentSetIndex: number;
  repetitions?: number;
  additionalWeight?: number;
  setLength: number;
};

const StyledSpan = ({ children }: { children: ReactNode }) => (
  <span className="dark:white mr-3 uppercase">{children}</span>
);

export const TrainingTimerInfo: FC<TrainingTimerInfoProps> = ({
  gripType,
  currentRepetition,
  currentSetIndex,
  repetitions,
  additionalWeight,
  setLength,
}) => {
  return (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white truncate">
        {gripType}
      </h3>
      <p className="text-xl dark:text-white">
        <StyledSpan>Rep</StyledSpan>
        {currentRepetition + 1} / {repetitions}
        {additionalWeight && additionalWeight > 0 ? (
          <span className="ml-2 text-blue-600 dark:text-blue-400">
            +{additionalWeight}kg
          </span>
        ) : null}
      </p>
      <p className="text-lg dark:text-white">
        <StyledSpan>Set</StyledSpan>
        {currentSetIndex + 1} / {setLength}
      </p>
    </>
  );
};

function getBackgroundColor(
  timerState: TimerState,
  isTimerViewBar?: boolean,
): string {
  if (timerState === TimerState.RESTING_AFTER_SET) {
    return isTimerViewBar ? "dark:bg-blue-600" : "dark:bg-blue-600/[20%]";
  }

  if (timerState === TimerState.RESTING_BETWEEN_REPS) {
    return isTimerViewBar ? "dark:bg-red-600" : "dark:bg-red-600/[20%]";
  }

  if (timerState === TimerState.HANGING) {
    return isTimerViewBar ? "dark:bg-green-600" : "dark:bg-green-600/[20%]";
  }

  if (timerState === TimerState.PREPARATION) {
    return isTimerViewBar ? "dark:bg-yellow-600" : "dark:bg-yellow-600/[20%]";
  }

  if (timerState === TimerState.PAUSED) {
    return isTimerViewBar ? "dark:bg-gray-500" : "dark:bg-gray-500/[20%]";
  }

  return isTimerViewBar ? "dark:bg-gray-900" : "dark:bg-gray-900/[20%]";
}

type TrainingTimerInfoWrapperProps = {
  children: ReactNode;
  isTimerViewBar?: boolean;
  timerState: TimerState;
  isDisplayNextSetInformation?: boolean;
};

export const TrainingTimerInfoWrapper: FC<TrainingTimerInfoWrapperProps> = ({
  children,
  isTimerViewBar,
  timerState,
  isDisplayNextSetInformation = false,
}) => {
  return (
    <Card
      className={`z-50 text-center min-h-[142px]  justify-center ${isTimerViewBar ? "max-w-sm min-w-64" : "w-full "} ${getBackgroundColor(timerState, isTimerViewBar)}`}
    >
      <CardContent className={"px-4 relative"}>
        <div className={"grid gap-2"}>{children}</div>
        {isDisplayNextSetInformation &&
          timerState === TimerState.RESTING_AFTER_SET && (
            <BadgeWrapper>
              <Badge variant={"outline"} className={"uppercase"}>
                Next
              </Badge>
            </BadgeWrapper>
          )}
      </CardContent>
    </Card>
  );
};

export const TrainingTimerInfoContainer = () => {
  const { state } = useTraining();
  const { timerData } = state;
  const { timerState, currentSession, currentSetIndex } = timerData;

  // If there is no current session, we don't show the info
  if (!currentSession) {
    return null;
  }

  const currentSet = getCurrentSetFromSession(currentSession, currentSetIndex);
  const isTimerViewBar = currentSession.timerView === TimerViewEnum.BAR;
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
      isTimerViewBar={isTimerViewBar}
      timerState={timerState}
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
          <p className="text-2xl text-gray-600 dark:text-gray-300 truncate">
            {gripType} / {currentSet.repetitions} Rep
            {currentSet.repetitions > 1 ? "s" : ""}
            {currentSet.additionalWeight > 0 && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                +{additionalWeight}kg
              </span>
            )}
          </p>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Set {nextSetIndex} of {setLength}
          </p>
        </>
      )}
    </TrainingTimerInfoWrapper>
  );
};

const BadgeWrapper: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div
      className={"absolute top-0 bottom-0 my-auto flex flex-col justify-center"}
    >
      {children}
    </div>
  );
};
