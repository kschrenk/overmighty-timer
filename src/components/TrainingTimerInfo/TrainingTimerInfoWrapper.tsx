import type { FC, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TimerState } from "@/types/training";
import { Badge } from "@/components/ui/badge";
import { TrainingTimerInfoBadgeWrapper } from "@/components/TrainingTimerInfo/TrainingTimerInfoBadge";

type TrainingTimerInfoWrapperProps = {
  children: ReactNode;
  timerState: TimerState;
  isDisplayNextSetInformation?: boolean;
};

function getBackgroundColor(timerState: TimerState): string {
  if (timerState === TimerState.RESTING_AFTER_SET) {
    return "bg-blue-700";
  }

  if (timerState === TimerState.RESTING_BETWEEN_REPS) {
    return "bg-red-700";
  }

  if (timerState === TimerState.HANGING) {
    return "bg-green-700";
  }

  if (timerState === TimerState.PREPARATION) {
    return "bg-yellow-600";
  }

  if (timerState === TimerState.PAUSED) {
    return "bg-gray-500";
  }

  return "dark:bg-gray-900";
}

export const TrainingTimerInfoWrapper: FC<TrainingTimerInfoWrapperProps> = ({
  children,
  timerState,
  isDisplayNextSetInformation = false,
}) => {
  return (
    <Card
      className={`z-50 py-4 text-center justify-center w-full ${getBackgroundColor(timerState)}`}
    >
      <CardContent className={"px-4 relative"}>
        <div className={"grid gap-2"}>{children}</div>
        {timerState === TimerState.RESTING_AFTER_SET ? (
          <>
            {isDisplayNextSetInformation ? (
              <TrainingTimerInfoBadgeWrapper>
                <Badge variant={"outline"} className={"uppercase"}>
                  Next
                </Badge>
              </TrainingTimerInfoBadgeWrapper>
            ) : (
              <TrainingTimerInfoBadgeWrapper>
                <Badge variant={"outline"} className={"uppercase"}>
                  Finished
                </Badge>
              </TrainingTimerInfoBadgeWrapper>
            )}
          </>
        ) : timerState === TimerState.PAUSED ? (
          <TrainingTimerInfoBadgeWrapper>
            <Badge className={"uppercase bg-gray-400 text-white"}>Paused</Badge>
          </TrainingTimerInfoBadgeWrapper>
        ) : null}
      </CardContent>
    </Card>
  );
};
