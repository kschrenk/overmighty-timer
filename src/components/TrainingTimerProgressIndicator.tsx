import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

import type { FC } from "react";

type ProgressIndicatorProps = {
  progress: number;
  secondsLeft: string;
  pathColor: string;
  textColor?: string;
};

export const ProgressIndicatorCircle: FC<ProgressIndicatorProps> = ({
  progress,
  secondsLeft,
  pathColor,
  textColor = "var(--color-foreground)",
}) => {
  return (
    <CircularProgressbar
      className={"timer-progress"}
      value={progress}
      text={secondsLeft}
      styles={buildStyles({
        trailColor: "var(--color-gray-600)",
        pathColor,
        textColor,
        textSize: "1.4rem",
        pathTransition:
          progress === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s",
      })}
      counterClockwise
    />
  );
};
