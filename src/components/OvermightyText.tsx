import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const OvermightyText = ({ children }: Props) => {
  return (
    <span
      className={
        "bg-gradient-to-r from-blue-600 to-pink-500 inline-block text-transparent bg-clip-text"
      }
    >
      {children}
    </span>
  );
};
