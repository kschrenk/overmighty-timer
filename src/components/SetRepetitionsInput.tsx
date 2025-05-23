import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { Label, LabelWrapper } from "@/components/ui/label";

interface SetRepetitionsInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  id: string;
}

export const SetRepetitionsInput: FC<SetRepetitionsInputProps> = ({
  value,
  min = 1,
  max = 10,
  onChange,
  id,
}) => (
  <div>
    <LabelWrapper className={"gap-3"}>
      <Label htmlFor={id}>Set Repetitions</Label>
      <div className="flex items-center space-x-2">
        <Button
          variant={"outline"}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease repetitions"
        >
          -
        </Button>
        <input
          type="number"
          id={id}
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 text-center"
        />
        <Button
          variant={"outline"}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label="Increase repetitions"
        >
          +
        </Button>
      </div>
    </LabelWrapper>
  </div>
);
