import type { FC } from "react";
import { Badge } from "@/components/ui/badge";

type Props = {
  gripType: string;
  currentRepetition: number;
  currentSetIndex: number;
  repetitions: number;
  additionalWeight: number;
  setLength: number;
  infoText?: "current" | "next" | "none";
};

export const TrainingTimerInfo: FC<Props> = ({
  gripType,
  currentRepetition,
  currentSetIndex,
  repetitions,
  additionalWeight,
  setLength,
  infoText = "none",
}) => {
  return (
    <>
      <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 truncate">
        {gripType}
      </h3>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        Rep {currentRepetition + 1} / {repetitions}
        {additionalWeight > 0 && (
          <span className="ml-2 text-blue-600 dark:text-blue-400">
            +{additionalWeight}kg
          </span>
        )}
      </p>
      <p className="text-lg text-gray-500 dark:text-gray-400">
        Set {currentSetIndex + 1} of {setLength}
      </p>
      {infoText !== "none" ? (
        <Badge variant={"outline"} className={"absolute uppercase"}>
          {infoText}
        </Badge>
      ) : null}
    </>
  );
};
