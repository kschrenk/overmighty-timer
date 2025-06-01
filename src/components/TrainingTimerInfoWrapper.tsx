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

function getBackgroundColor(
  timerState: TimerState,
  isDisplayNextSetInformation: boolean = false,
): string {
  if (
    (isDisplayNextSetInformation &&
      timerState === TimerState.RESTING_AFTER_SET) ||
    timerState === TimerState.RESTING_BETWEEN_REPS
  ) {
    return `dark:bg-red-600/[30%]`;
  }

  if (timerState === TimerState.HANGING) {
    return `dark:bg-green-600/[30%]`;
  }

  if (timerState === TimerState.PREPARATION) {
    return `dark:bg-yello-600/[30%]`;
  }

  return `dark:bg-gray-900/[30%]`;
}

export const TrainingTimerInfoWrapper: FC<Props> = ({
  children,
  isTimerViewBar,
  isDisplayNextSetInformation,
  timerState,
}) => {
  return (
    <Card
      className={`z-50 text-center min-h-[142px]  justify-center ${isTimerViewBar ? "max-w-sm min-w-64" : "w-full "} ${getBackgroundColor(timerState, isDisplayNextSetInformation)}`}
    >
      <CardContent className={"px-4 relative"}>
        <div className={"grid gap-2"}>{children}</div>
        {timerState === TimerState.RESTING_AFTER_SET &&
        isDisplayNextSetInformation ? (
          <div
            className={
              "absolute top-0 bottom-0 my-auto flex flex-col justify-center"
            }
          >
            <Badge variant={"outline"} className={"uppercase"}>
              Next
            </Badge>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
