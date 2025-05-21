import type { FC } from "react";

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
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
    >
      Set Repetitions
    </label>
    <div className="flex items-center space-x-2">
      <button
        type="button"
        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease repetitions"
      >
        -
      </button>
      <input
        type="number"
        id={id}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 text-center"
      />
      <button
        type="button"
        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase repetitions"
      >
        +
      </button>
    </div>
  </div>
);
