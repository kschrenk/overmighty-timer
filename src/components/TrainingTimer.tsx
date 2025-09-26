import React, { useEffect, useState } from "react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { TimerState } from "@/types/training";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWakeLock } from "@/hooks/useWakeLock";
import { TrainingTimerProgressIndicatorContainer } from "@/components/TrainingTimerProgressIndicator";
import { TrainingTimerControls } from "@/components/TrainingTimerControls";
import { TrainingTimerInfoContainer } from "@/components/TrainingTimerInfo/TrainingTimerInfoContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Slide, Slider } from "@/components/ui/slider";
import { HeaderTitle } from "@/components/HeaderTitle";

const TrainingTimer: React.FC = () => {
  const { state, dispatch } = useTraining();
  const [progress, setProgress] = useState(0); // start at 0 for new phase
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const [previousTimerState, setPreviousTimerState] =
    useState<TimerState | null>(null);
  const [phaseDuration, setPhaseDuration] = useState<number | null>(null);

  const { timerData } = state;
  const { currentSession, currentSetIndex, timerState } = timerData;
  const currentSet = currentSession?.sets[currentSetIndex] ?? null;

  useEffect(() => {
    (async () => {
      await requestWakeLock();
      return () => {
        releaseWakeLock();
      };
    })();
  }, [releaseWakeLock, requestWakeLock]);

  useEffect(() => {
    const currentTimerState = timerState;

    // Detect phase change
    if (previousTimerState !== currentTimerState) {
      // Determine new duration for this phase
      let newDuration = 0;
      switch (currentTimerState) {
        case TimerState.HANGING:
          newDuration = currentSet?.hangTime ?? 0;
          break;
        case TimerState.RESTING_BETWEEN_REPS:
          newDuration = currentSet?.rest ?? 0;
          break;
        case TimerState.RESTING_AFTER_SET:
          newDuration = currentSet?.restAfter ?? 0;
          break;
        case TimerState.PREPARATION:
          newDuration = currentSession?.preparationTime ?? 0;
          break;
        default:
          newDuration = 0;
      }
      setPhaseDuration(newDuration || null);
      setProgress(0); // fresh phase starts visually empty
      setPreviousTimerState(currentTimerState);
      return; // skip progress calc this render to avoid jump
    }
  }, [
    timerState,
    previousTimerState,
    currentSet?.hangTime,
    currentSet?.rest,
    currentSet?.restAfter,
    currentSession?.preparationTime,
  ]);

  // Recalculate progress when secondsLeft changes within the same phase
  useEffect(() => {
    if (!phaseDuration || phaseDuration <= 0) return;

    const L = timerData.secondsLeft; // 1..phaseDuration while active (no 0)
    // For duration 1 we can only show 0 -> immediate transition next tick; keep 0 (no rewind)
    if (phaseDuration === 1) {
      setProgress(0);
      return;
    }

    // Progress formula ensuring:
    //  L = phaseDuration => progress = 0
    //  L = 1 => progress = 100
    const raw = ((phaseDuration - L) / (phaseDuration - 1)) * 100;
    const bounded = Math.max(0, Math.min(100, raw));
    setProgress(bounded);
  }, [phaseDuration, timerData.secondsLeft]);

  const handleStart = () => {
    if (currentSession) {
      dispatch({ type: "START_SESSION", payload: currentSession });
    }
  };

  const handleStop = () => {
    toast.warning("Stop the timer?", {
      position: "top-center",
      closeButton: true,
      action: {
        label: "OK",
        onClick: () => {
          dispatch({ type: "RESET_TIMER" });
          dispatch({ type: "GO_TO_HOME" });
          toast.success("Timer stopped and returned to home", {
            position: "top-center",
            closeButton: true,
          });
        },
      },
    });
  };

  const handlePause = () => {
    dispatch({ type: "PAUSE_TIMER", payload: timerState });
  };

  const handleResume = () => {
    dispatch({ type: "RESUME_TIMER" });
  };

  const handleRestartWithConfirm = () => {
    if (!currentSession) return;
    toast("Restart session?", {
      position: "top-center",
      closeButton: true,
      action: {
        label: "Restart",
        onClick: () => {
          dispatch({ type: "START_SESSION", payload: currentSession });
          toast.success("Session restarted", { position: "top-center" });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          /* no-op cancel */
        },
      },
    });
  };

  if (!currentSession || !currentSet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No active training session
        </p>
        <Button
          onClick={() => dispatch({ type: "GO_TO_HOME" })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-xs"
        >
          Go to Home
        </Button>
      </div>
    );
  }

  const isIdle = timerState === TimerState.IDLE;
  const isFinished = timerState === TimerState.FINISHED;
  const isPaused = timerState === TimerState.PAUSED;
  const isRunning = !isIdle && !isFinished && !isPaused;

  return (
    <Slider>
      <Slide>
        <div className="flex flex-col max-w-md mx-auto py-4 px-6 h-full justify-between">
          <div className="flex-1 flex items-center justify-center max-h-[64dvh]">
            <TrainingTimerProgressIndicatorContainer progress={progress} />
          </div>
          <div className="shrink-0">
            <TrainingTimerInfoContainer />
          </div>
          <TrainingTimerControls
            isIdle={isIdle}
            isFinished={isFinished}
            isRunning={isRunning}
            isPaused={isPaused}
            handleStart={handleStart}
            handlePause={handlePause}
            handleResume={handleResume}
            handleStop={handleStop}
            handleRestart={handleRestartWithConfirm}
          />
        </div>
      </Slide>
      <Slide>
        <div className={"grid gap-6 px-4 py-6"}>
          <HeaderTitle
            title={currentSession.name}
            showBackButton
            onBack={() => dispatch({ type: "GO_TO_HOME" })}
          />
          <Card className={"mb-6"}>
            <CardHeader>
              <CardTitle>Session Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Set</TableHead>
                    <TableHead>Hang Time</TableHead>
                    <TableHead>Reps</TableHead>
                    <TableHead>Rest</TableHead>
                    <TableHead>Rest After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSession.sets.map((set, index) => (
                    <TableRow
                      key={set.id}
                      className={
                        currentSetIndex === index ? "dark:bg-pink-800" : ""
                      }
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{set.hangTime} sec</TableCell>
                      <TableCell>{set.repetitions}</TableCell>
                      <TableCell>{set.rest} sec</TableCell>
                      <TableCell>{set.restAfter} sec</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div>
            <Button
              onClick={() => {
                dispatch({ type: "RESET_TIMER" });
                dispatch({ type: "GO_TO_HOME" });
              }}
            >
              Go to home
            </Button>
          </div>
        </div>
      </Slide>
    </Slider>
  );
};

export default TrainingTimer;
