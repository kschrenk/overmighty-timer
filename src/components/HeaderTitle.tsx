import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import { OvermightyText } from "@/components/OvermightyText";

interface HeaderTitleProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const HeaderTitle: FC<HeaderTitleProps> = ({
  title,
  showBackButton = false,
  onBack,
}) => {
  return (
    <div className="flex items-center">
      {showBackButton && (
        <button
          className="mr-3 p-1 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          onClick={onBack}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-2xl font-bold tracking-tight">
        <OvermightyText>{title}</OvermightyText>
      </h1>
    </div>
  );
};
