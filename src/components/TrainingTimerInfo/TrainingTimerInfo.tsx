import type { FC, ReactNode } from "react";

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
      <p className="text-xl dark:text-gray-100">
        <StyledSpan>Rep</StyledSpan>
        {currentRepetition + 1} / {repetitions}
        {additionalWeight && additionalWeight > 0 ? (
          <span className="ml-2 text-sky-300">+{additionalWeight}kg</span>
        ) : null}
      </p>
      <p className="text-lg dark:text-gray-100">
        <StyledSpan>Set</StyledSpan>
        {currentSetIndex + 1} / {setLength}
      </p>
    </>
  );
};
