// src/components/SliderInput.tsx
import React, { useState, useRef, useEffect, useMemo, useId } from "react";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import debounce from "lodash.debounce";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TimeSecondsInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  setName?: string;
  disabled?: boolean;
  className?: string;
  debounceMs?: number;
  unitSuffix?: string;
  labelNode?: React.ReactNode;
  /** Enable fine controls only on mobile (pointer: coarse). */
  showMobileFineControls?: boolean;
  /** Increment used by +/- buttons on mobile. */
  mobileFineStep?: number;
  /** Commit fine control changes immediately (no debounce). */
  mobileImmediateCommit?: boolean;
  /** When provided, and the user toggles "Edit all", updates will call this instead of onChange to apply value to all sets. */
  onChangeAll?: (value: number) => void;
  title?: string;
}

export const SliderInput: React.FC<TimeSecondsInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 600,
  step = 1,
  label,
  disabled,
  className,
  debounceMs = 200,
  unitSuffix = "s",
  labelNode,
  showMobileFineControls = true,
  mobileFineStep = 1,
  mobileImmediateCommit = true,
  onChangeAll,
  title,
}) => {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<number>(value);
  const [editAll, setEditAll] = useState(false);

  const prevOpenRef = useRef<boolean>(false);
  const hasInteractedRef = useRef(false);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const debouncedCommitSingle = useMemo(
    () =>
      debounce((v: number) => {
        onChange(v);
      }, debounceMs),
    [onChange, debounceMs],
  );

  const debouncedCommitAll = useMemo(
    () =>
      debounce((v: number) => {
        if (onChangeAll) {
          onChangeAll(v);
        }
      }, debounceMs),
    [onChangeAll, debounceMs],
  );

  useEffect(() => {
    if (!hasInteractedRef.current) {
      // @TODO: fix this
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalValue(value);
    }
  }, [value]);

  const commitValue = (v: number, immediate = false) => {
    const cv = clamp(v);
    setInternalValue(cv);
    const isAll = editAll && !!onChangeAll;
    if (immediate) {
      if (isAll) {
        debouncedCommitAll.cancel();
        onChangeAll?.(cv);
      } else {
        debouncedCommitSingle.cancel();
        onChange(cv);
      }
    } else {
      if (isAll) {
        debouncedCommitAll(cv);
      } else {
        debouncedCommitSingle(cv);
      }
    }
  };

  const handleRangeChange = (vals: number[]) => {
    hasInteractedRef.current = true;
    commitValue(vals[0]);
  };

  const nudge = (delta: number) => {
    hasInteractedRef.current = true;
    const next = clamp(
      (Number.isFinite(internalValue) ? internalValue : value) + delta,
    );
    commitValue(next, mobileImmediateCommit);
  };

  const openDrawer = () => {
    if (!disabled) setOpen(true);
  };

  useEffect(() => {
    if (prevOpenRef.current !== open) {
      window.dispatchEvent(
        new CustomEvent("app:drawer-open-change", { detail: { open } }),
      );
      prevOpenRef.current = open;
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      // flush both debounce queues
      debouncedCommitSingle.flush();
      debouncedCommitAll.flush();
      hasInteractedRef.current = false;
    }
  }, [open, debouncedCommitSingle, debouncedCommitAll]);

  useEffect(() => {
    return () => {
      debouncedCommitSingle.flush();
      debouncedCommitAll.flush();
    };
  }, [debouncedCommitSingle, debouncedCommitAll]);

  return (
    <div className={className}>
      {(labelNode || label) && (
        <Label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {labelNode || label}
        </Label>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <Input
          id={id}
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
              <DrawerTitle
                className={title ? "flex flex-col gap-1" : undefined}
              >
                {title ? (
                  <span className={"dark:text-gray-500"}>{title}</span>
                ) : null}
                <span>{label || "Select Time"}</span>
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-6 pb-10 flex flex-col gap-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {min}
                  {unitSuffix}
                </span>
                <span className="font-semibold text-lg text-foreground">
                  {internalValue}
                  {unitSuffix}
                </span>
                <span>
                  {max}
                  {unitSuffix}
                </span>
              </div>
              <div data-vaul-no-drag>
                <Slider
                  value={[internalValue]}
                  min={min}
                  max={max}
                  step={step}
                  onValueChange={handleRangeChange}
                />
              </div>
              {showMobileFineControls && (
                <div
                  className={`flex gap-2 ${onChangeAll ? "justify-between" : "justify-end"} items-center`}
                >
                  {onChangeAll ? (
                    <Label>
                      <Checkbox
                        checked={editAll}
                        onClick={() => setEditAll((prevState) => !prevState)}
                      />
                      <span>{`Edit all`}</span>
                    </Label>
                  ) : null}
                  <div className={"flex gap-3"}>
                    <Button
                      aria-label="Decrement"
                      variant={"outline"}
                      onClick={() => nudge(-mobileFineStep)}
                    >
                      <Minus />
                    </Button>
                    <Button
                      aria-label="Increment"
                      variant={"outline"}
                      onClick={() => nudge(mobileFineStep)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
};

export default SliderInput;
