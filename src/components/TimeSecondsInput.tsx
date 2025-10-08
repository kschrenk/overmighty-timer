import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import debounce from "lodash.debounce";
import {Slider} from "@/components/ui/slider";

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
  /** Suffix unit displayed next to min/current/max values inside the drawer (default: 's'). */
  unitSuffix?: string;
  /** Optional rich label node (overrides label string if provided). */
  labelNode?: React.ReactNode;
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
  unitSuffix = 's',
  labelNode,
}) => {
  const [open, setOpen] = useState(false);
  // track previous open to dispatch deltas
  const prevOpenRef = useRef<boolean>(false);
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


  const handleRangeChange = (value: number[]) => {
    hasInteractedRef.current = true;
    const [v] = value
    setInternalValue(v);
    debouncedCommit(v);
  };

  const openDrawer = () => {
    if (disabled) return;
    setOpen(true);
  };

  // Emit global event whenever drawer open state changes so other UI (e.g., scroll navigator) can react
  useEffect(() => {
    if (prevOpenRef.current !== open) {
      const detail = { open };
      window.dispatchEvent(new CustomEvent('app:drawer-open-change', { detail }));
      prevOpenRef.current = open;
    }
  }, [open]);

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
      {labelNode || label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {labelNode || label}
        </label>
      ) : null}
      <Drawer open={open} onOpenChange={setOpen}>
        <Input
          id={id}
          ref={inputRef}
          type="text"
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
            <div className="px-6 pb-8 flex flex-col gap-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{min}{unitSuffix}</span>
                <span className="font-semibold text-base text-foreground">
                  {internalValue}{unitSuffix}
                </span>
                <span>{max}{unitSuffix}</span>
              </div>
              <div data-vaul-no-drag>
                <Slider value={[internalValue]} min={min} max={max} onValueChange={handleRangeChange} step={step} />
              </div>
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
};

export default TimeSecondsInput;
