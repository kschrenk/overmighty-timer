import type { FC } from "react";

export const SectionDividerWithTitle: FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      <div className="px-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">
          {title}
        </h3>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
    </div>
  );
};
