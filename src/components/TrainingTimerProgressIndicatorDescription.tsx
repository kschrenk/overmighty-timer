import type { FC } from "react";

type Props = {
  description: string;
};

export const TrainingTimerProgressIndicatorDescription: FC<Props> = ({
  description,
}) => {
  return (
    <div className={"inline-flex"}>
      <span className="text-2xl uppercase font-extrabold tracking-wider text-gray-600 dark:text-gray-100">
        {description}
      </span>
    </div>
  );
};
