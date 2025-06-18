import { Progress } from "@/components/ui/progress";
import { formatTime, getStateDescription } from "@/utils/timerUtils";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { TimerState, TimerViewEnum } from "@/types/training";
import type { FC, ReactNode } from "react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";

const getProgressColor = (
  timerState: TimerState,
  timerView?: TimerViewEnum,
) => {
  switch (timerState) {
    case TimerState.HANGING:
      return timerView === TimerViewEnum.BAR
        ? "bg-green-600"
        : "var(--color-green-700)";
    case TimerState.RESTING_BETWEEN_REPS:
    case TimerState.RESTING_AFTER_SET:
      return timerView === TimerViewEnum.BAR
        ? "bg-red-700"
        : "var(--color-red-700)";
    case TimerState.PREPARATION:
      return timerView === TimerViewEnum.BAR
        ? "bg-yellow-600"
        : "var(--color-yellow-600)";
    default:
      return timerView === TimerViewEnum.BAR
        ? "bg-gray-300"
        : "var(--color-gray-300)";
  }
};

type Props = {
  progress: number;
};

export const TrainingTimerProgressIndicatorContainer: FC<Props> = ({
  progress,
}) => {
  const { state } = useTraining();
  const { timerData } = state;
  const { timerState, currentSession } = timerData;

  if (!currentSession) {
    return null;
  }

  if (currentSession.timerView === TimerViewEnum.BAR) {
    return (
      <ProgressIndicatorBar
        progress={progress}
        secondsLeft={formatTime(timerData.secondsLeft)}
        pathColor={getProgressColor(timerState, currentSession.timerView)}
        description={getStateDescription(timerState)}
      />
    );
  }

  return (
    <ProgressIndicatorCircle
      progress={progress}
      secondsLeft={formatTime(timerData.secondsLeft)}
      pathColor={getProgressColor(timerState, currentSession.timerView)}
      description={getStateDescription(timerState)}
    />
  );
};

type ProgressIndicatorProps = {
  progress: number;
  secondsLeft: string;
  pathColor: string;
  description: string;
  textColor?: string;
};

export const ProgressIndicatorCircle: FC<ProgressIndicatorProps> = ({
  progress,
  secondsLeft,
  pathColor,
  description,
  textColor = "var(--color-foreground)",
}) => {
  return (
    <Wrapper>
      <CircularProgressbar
        className={"pb-6"}
        value={progress}
        text={secondsLeft}
        styles={buildStyles({
          trailColor: "var(--color-gray-600)",
          pathColor,
          textColor,
          pathTransition:
            progress === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s",
        })}
        counterClockwise
      />
      <div className={"inline-flex pb-6"}>
        <span className="text-xl uppercase font-extrabold tracking-wider text-gray-600 dark:text-gray-400">
          {description}
        </span>
      </div>
    </Wrapper>
  );
};

const ProgressIndicatorBar: FC<ProgressIndicatorProps> = ({
  progress,
  secondsLeft,
  pathColor,
  description,
}) => {
  return (
    <Wrapper>
      <Progress
        value={progress}
        classNameIndicator={pathColor}
        className={"absolute inset-0 h-full rounded-none"}
      />
      <div className="relative w-64 h-64 mb-6 z-50">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-8xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            {secondsLeft}
          </div>
          <div className="text-lg uppercase font-medium tracking-wider text-gray-600 dark:text-white">
            {description}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="grow flex flex-col items-center justify-center py-8 relative">
    {children}
  </div>
);
