import type { FC, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TimerState } from "@/types/training";
import { Badge } from "@/components/ui/badge";

type Props = {
  children: ReactNode;
  isTimerViewBar?: boolean;
  isDisplayNextSetInformation?: boolean;
  timerState: TimerState;
};

function getBackgroundColor(timerState: TimerState): string {
  if (timerState === TimerState.RESTING_AFTER_SET) {
    return `dark:bg-blue-600/[20%]`;
  }

  if (timerState === TimerState.RESTING_BETWEEN_REPS) {
    return `dark:bg-red-600/[20%]`;
  }

  if (timerState === TimerState.HANGING) {
    return `dark:bg-green-600/[20%]`;
  }

  if (timerState === TimerState.PREPARATION) {
    return `dark:bg-yellow-600/[20%]`;
  }

  if (timerState === TimerState.PAUSED) {
    return `dark:bg-gray-500/[20%]`;
  }

  return `dark:bg-gray-900/[20%]`;
}

export const TrainingTimerInfoWrapper: FC<Props> = ({
  children,
  isTimerViewBar,
  isDisplayNextSetInformation,
  timerState,
}) => {
  return (
    <Card
      className={`z-50 text-center min-h-[142px]  justify-center ${isTimerViewBar ? "max-w-sm min-w-64" : "w-full "} ${getBackgroundColor(timerState)}`}
    >
      <CardContent className={"px-4 relative"}>
        <div className={"grid gap-2"}>{children}</div>
        <BadgeContainer
          timerState={timerState}
          isDisplayNextSetInformation={isDisplayNextSetInformation}
        />
      </CardContent>
    </Card>
  );
};

const BadgeContainer: FC<{
  timerState: TimerState;
  isDisplayNextSetInformation?: boolean;
}> = ({ timerState, isDisplayNextSetInformation }) => {
  return (
    <>
      {timerState === TimerState.RESTING_AFTER_SET ? (
        isDisplayNextSetInformation ? (
          <BadgeWrapper>
            <Badge variant={"outline"} className={"uppercase"}>
              Next
            </Badge>
          </BadgeWrapper>
        ) : (
          <BadgeWrapper>
            <Badge variant={"outline"} className={"uppercase"}>
              Last
            </Badge>
          </BadgeWrapper>
        )
      ) : null}
    </>
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
