import type { FC, ReactNode } from "react";

export const TrainingTimerInfoBadgeWrapper: FC<{
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
