import React, { useEffect, useState } from "react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { TimerState, TimerViewEnum } from "@/types/training";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWakeLock } from "@/hooks/useWakeLock";
import { TrainingTimerProgressIndicatorContainer } from "@/components/TrainingTimerProgressIndicator";
import { TrainingTimerControls } from "@/components/TrainingTimerControls";
import { TrainingTimerInfoContainer } from "@/components/TrainingTimerInfo/TrainingTimerInfoContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OvermightyText } from "@/components/OvermightyText";
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
  const [progress, setProgress] = useState(100);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

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
    const { timerState } = timerData;
    let currentTime = 0;

    switch (timerState) {
      case TimerState.HANGING:
        currentTime = currentSet?.hangTime ?? 0;
        break;
      case TimerState.RESTING_BETWEEN_REPS:
        currentTime = currentSet?.rest ?? 0;
        break;
      case TimerState.RESTING_AFTER_SET:
        currentTime = currentSet?.restAfter ?? 0;
        break;
      case TimerState.PREPARATION:
        currentTime = currentSession?.preparationTime ?? 0;
        break;
      default:
        currentTime = 0;
        break;
    }

    if (!currentTime) return;

    const rawProgress =
      ((currentTime - timerData.secondsLeft) / currentTime) * 100;

    setProgress(Math.max(0, Math.min(100, rawProgress)));
  }, [
    currentSet?.hangTime,
    currentSet?.rest,
    currentSet?.restAfter,
    currentSession?.preparationTime,
    timerData,
    timerData.secondsLeft,
    timerState,
  ]);

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
          toast.success("Timer stopped and returned to home");
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

  const handleRestart = () => {
    dispatch({ type: "RESET_TIMER" });
    handleStart();
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
  const isTimerViewBar = currentSession.timerView === TimerViewEnum.BAR;

  return (
    <Slider>
      <Slide>
        <div
          className={`flex flex-col max-w-md mx-auto py-4 ${!isTimerViewBar ? "px-6" : "px-0"} h-full justify-between`}
        >
          <h3
            className={
              "text-center truncate font-semibold text-gray-400 shrink-0"
            }
          >
            <OvermightyText>{currentSession.name}</OvermightyText>
          </h3>
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
            handleRestart={handleRestart}
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
              <CardTitle>{currentSession.name}</CardTitle>
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
