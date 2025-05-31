import type { FC } from "react";

type Props = {
  gripType?: string;
  currentRepetition: number;
  currentSetIndex: number;
  repetitions?: number;
  additionalWeight?: number;
  setLength: number;
};

export const TrainingTimerInfo: FC<Props> = ({
  gripType,
  currentRepetition,
  currentSetIndex,
  repetitions,
  additionalWeight,
  setLength,
}) => {
  return (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 truncate">
        {gripType}
      </h3>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        Rep {currentRepetition + 1} / {repetitions}
        {additionalWeight && additionalWeight > 0 ? (
          <span className="ml-2 text-blue-600 dark:text-blue-400">
            +{additionalWeight}kg
          </span>
        ) : null}
      </p>
      <p className="text-lg text-gray-500 dark:text-gray-400">
        Set {currentSetIndex + 1} of {setLength}
      </p>
    </>
  );
};
