import { formatTime, getStateDescription } from "@/utils/timerUtils";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { TimerState } from "@/types/training";
import type { FC, ReactNode } from "react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";

const getProgressColor = (timerState: TimerState) => {
  switch (timerState) {
    case TimerState.HANGING:
      return "var(--color-green-700)";
    case TimerState.RESTING_BETWEEN_REPS:
    case TimerState.RESTING_AFTER_SET:
      return "var(--color-red-700)";
    case TimerState.PREPARATION:
      return "var(--color-yellow-600)";
    default:
      return "var(--color-gray-300)";
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

  return (
    <ProgressIndicatorCircle
      progress={progress}
      secondsLeft={formatTime(timerData.secondsLeft)}
      pathColor={getProgressColor(timerState)}
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
        className={"h-full"}
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
      <div className={"inline-flex"}>
        <span className="text-xl uppercase font-extrabold tracking-wider text-gray-600 dark:text-gray-400">
          {description}
        </span>
      </div>
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col items-center relative gap-4 basis-full shrink">
    {children}
  </div>
);
