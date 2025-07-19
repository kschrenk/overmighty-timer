import type { FC, ReactNode } from "react";

type SliderContainerProps = {
  children: ReactNode | ReactNode[];
};

type SlideProps = {
  children: ReactNode;
};

export const Slider: FC<SliderContainerProps> = ({ children }) => {
  return (
    <div
      className={
        "h-dvh snap-y snap-mandatory overflow-x-hidden overflow-y-auto"
      }
    >
      {children}
    </div>
  );
};

export const Slide: FC<SlideProps> = ({ children }) => {
  return (
    <section className={"h-full w-full snap-start overflow-hidden"}>
      {children}
    </section>
  );
};
