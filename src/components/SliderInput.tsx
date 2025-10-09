// src/components/SliderInput.tsx
          import React, { useState, useRef, useEffect, useMemo, useId} from "react";
          import { Input } from "@/components/ui/input";
          import {
            Drawer,
            DrawerContent,
            DrawerHeader,
            DrawerTitle,
          } from "@/components/ui/drawer";
          import debounce from "lodash.debounce";
          import { Slider } from "@/components/ui/slider";

          interface TimeSecondsInputProps {
            value: number;
            onChange: (value: number) => void;
            min?: number;
            max?: number;
            step?: number;
            label?: string;
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
          }

          const useCoarsePointer = () => {
            const [coarse, setCoarse] = useState<boolean>(() =>
              typeof window !== "undefined"
                ? window.matchMedia("(pointer: coarse)").matches
                : false,
            );
            useEffect(() => {
              const mql = window.matchMedia("(pointer: coarse)");
              const handler = (e: MediaQueryListEvent) => setCoarse(e.matches);
              if (mql.addEventListener) mql.addEventListener("change", handler);
              else mql.addListener(handler);
              return () => {
                if (mql.removeEventListener) mql.removeEventListener("change", handler);
                else mql.removeListener(handler);
              };
            }, []);
            return coarse;
          };

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
          }) => {
            const id = useId()
            const [open, setOpen] = useState(false);
            const prevOpenRef = useRef<boolean>(false);
            const [internalValue, setInternalValue] = useState<number>(value);
            const hasInteractedRef = useRef(false);
            const isMobile = useCoarsePointer();

            const clamp = (v: number) => Math.min(max, Math.max(min, v));

            const debouncedCommit = useMemo(
              () =>
                debounce((v: number) => {
                  onChange(v);
                }, debounceMs),
              [onChange, debounceMs],
            );

            useEffect(() => {
              if (!hasInteractedRef.current) {
                setInternalValue(value);
              }
            }, [value]);

            const commitValue = (v: number, immediate = false) => {
              const cv = clamp(v);
              setInternalValue(cv);
              if (immediate) {
                debouncedCommit.cancel();
                onChange(cv);
              } else {
                debouncedCommit(cv);
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

            const handleExactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              hasInteractedRef.current = true;
              const parsed = Number(e.target.value);
              if (!Number.isNaN(parsed)) {
                commitValue(parsed, mobileImmediateCommit);
              }
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
                debouncedCommit.flush();
                hasInteractedRef.current = false;
              }
            }, [open, debouncedCommit]);

            useEffect(() => {
              return () => {
                debouncedCommit.flush();
              };
            }, [debouncedCommit]);

            return (
              <div className={className}>
                {(labelNode || label) && (
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    {labelNode || label}
                  </label>
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
                        <DrawerTitle>{label || "Select Time"}</DrawerTitle>
                      </DrawerHeader>
                      <div className="px-6 pb-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{min}{unitSuffix}</span>
                          <span className="font-semibold text-base text-foreground">
                            {internalValue}{unitSuffix}
                          </span>
                          <span>{max}{unitSuffix}</span>
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

                        {isMobile && showMobileFineControls && (
                          <div className="flex flex-col gap-3">
                            <label className="text-xs font-medium text-muted-foreground">
                              Precise value
                            </label>
                            <div className="flex items-stretch gap-2">
                              <button
                                type="button"
                                onClick={() => nudge(-mobileFineStep)}
                                className="px-3 rounded-md border text-sm bg-muted hover:bg-muted/80 transition"
                                aria-label="Decrement"
                              >
                                -{mobileFineStep}
                              </button>
                              <Input
                                type="number"
                                inputMode="numeric"
                                className="text-center"
                                value={String(internalValue)}
                                onChange={handleExactInputChange}
                                onKeyDown={(e) => {
                                  if (e.key === "ArrowUp") {
                                    e.preventDefault();
                                    nudge(mobileFineStep);
                                  } else if (e.key === "ArrowDown") {
                                    e.preventDefault();
                                    nudge(-mobileFineStep);
                                  } else if (e.key === "Enter") {
                                    setOpen(false);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => nudge(mobileFineStep)}
                                className="px-3 rounded-md border text-sm bg-muted hover:bg-muted/80 transition"
                                aria-label="Increment"
                              >
                                +{mobileFineStep}
                              </button>
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Tap +/- for fine adjust</span>
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