import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import debounce from "lodash.debounce";

interface TimeSecondsInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
  /** Delay (ms) for debouncing slider-driven changes. Defaults to 200ms. */
  debounceMs?: number;
}

/**
 * TimeSecondsInput
 * Slider-only seconds selector. Focusing or clicking the display field opens a drawer
 * with a debounced range slider. The field itself is read-only so the mobile keyboard
 * does not appear (inputMode="none" + readOnly). All updates originate from the slider.
 */
export const TimeSecondsInput: React.FC<TimeSecondsInputProps> = ({
  id,
  value,
  onChange,
  min = 0,
  max = 600,
  step = 1,
  label,
  disabled,
  className,
  debounceMs = 200,
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<number>(value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasInteractedRef = useRef(false);

  // Debounced commit for slider-driven updates only
  const debouncedCommit = useMemo(
    () =>
      debounce((v: number) => {
        onChange(v);
      }, debounceMs),
    [onChange, debounceMs],
  );

  // Keep internal slider value in sync when external value changes (unless user is currently sliding)
  useEffect(() => {
    if (!hasInteractedRef.current) {
      setInternalValue(value);
    }
  }, [value]);

  const clamp = (val: number) => Math.min(max, Math.max(min, val));

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hasInteractedRef.current = true;
    const v = clamp(parseInt(e.target.value, 10) || 0);
    setInternalValue(v);
    debouncedCommit(v); // debounced update
  };

  const openDrawer = () => {
    if (disabled) return;
    setOpen(true);
  };

  // Flush pending debounced updates when drawer closes or component unmounts
  useEffect(() => {
    if (!open) {
      debouncedCommit.flush();
      hasInteractedRef.current = false; // allow resync with external value when reopening
    }
  }, [open, debouncedCommit]);

  useEffect(() => {
    return () => {
      debouncedCommit.flush();
    };
  }, [debouncedCommit]);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <Input
          id={id}
          ref={inputRef}
          type="text"
          // Prevent mobile keyboard: readOnly + inputMode none
          readOnly
          inputMode="none"
          disabled={disabled}
          value={String(value)}
          onFocus={openDrawer}
          onClick={openDrawer}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={label || "Seconds"}
          className="cursor-pointer select-none"
        />
        {open && (
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label || "Select Time"}</DrawerTitle>
            </DrawerHeader>
            <div className="px-6 pb-6 flex flex-col gap-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{min}s</span>
                <span className="font-semibold text-base text-foreground">
                  {internalValue}s
                </span>
                <span>{max}s</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={internalValue}
                onChange={handleRangeChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-600 to-blue-400 disabled:opacity-50"
                aria-label={label || "Seconds slider"}
              />
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
};

export default TimeSecondsInput;
