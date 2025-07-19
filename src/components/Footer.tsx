import type { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="py-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
      <p>Overmighty Timer &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};
