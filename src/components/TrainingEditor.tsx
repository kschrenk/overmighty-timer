import React, { useState } from "react";
import { Bath, Copy, FolderPen, Plus, Save, Trash2 } from "lucide-react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import type { Set } from "@/types/training";
import { TimerViewEnum } from "@/types/training";
import { generateId } from "@/utils/timerUtils";
import { useAuth } from "@/context/AuthContext";
import { updateTrainingSession } from "@/lib/firestoreUtils";
import { Label } from "./ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isUidTestUser } from "@/lib/testUser";
import { Card, CardContent } from "@/components/ui/card";
import { LabelWrapper } from "@/components/LabelWrapper";
import { SectionDividerWithTitle } from "@/components/ui/sectionDividerWithTitle";
import TimeSecondsInput from "@/components/TimeSecondsInput";

const TrainingEditor: React.FC = () => {
  const { currentUser } = useAuth();
  const { state, dispatch } = useTraining();
  const { editingSession } = state;

  const [sessionName, setSessionName] = useState(editingSession?.name || "");
  const [preparationTime, setPreparationTime] = useState<number>(
    editingSession?.preparationTime ?? 0,
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(e.target.value);
  };

  const handlePreparationTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPreparationTime(parseInt(e.target.value));
  };

  const handleSave = () => {
    if (!editingSession) return;

    if (!sessionName.trim()) {
      alert("Please enter a session name");
      return;
    }

    if (editingSession.sets.length === 0) {
      alert("Please add at least one set");
      return;
    }

    const updatedSession = {
      ...editingSession,
      name: sessionName,
      preparationTime,
      timerView: TimerViewEnum.CIRCLE,
    };

    if (isUidTestUser(currentUser?.uid)) {
      dispatch({ type: "SAVE_SESSION", payload: updatedSession });
      return;
    }

    updateTrainingSession({
      userId: currentUser?.uid,
      session: updatedSession,
    })
      .then(() => {
        dispatch({ type: "SAVE_SESSION", payload: updatedSession });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        toast.success(`Session "${updatedSession.name}" saved successfully!`, {
          position: "top-center",
          duration: 3000,
        });
      });
  };

  const handleAddSet = () => {
    const newSet: Set = {
      id: generateId(),
      gripType: "New Grip",
      hangTime: 10,
      rest: 3,
      repetitions: 3,
      restAfter: 60,
      additionalWeight: 0,
    };

    dispatch({ type: "ADD_SET", payload: newSet });
  };

  const handleCancel = () => {
    toast("Discard changes?", {
      closeButton: true,
      action: {
        label: "OK",
        onClick: () => dispatch({ type: "GO_TO_HOME" }),
      },
    });
  };

  const handleSetChange = (
    id: string,
    field: keyof Set,
    value: number | string,
  ) => {
    if (!editingSession) return;

    const updatedSet = editingSession.sets.find((s) => s.id === id);
    if (!updatedSet) return;

    const newSet = { ...updatedSet, [field]: value };
    dispatch({ type: "UPDATE_SET", payload: newSet });
  };

  const handleDeleteSet = (id: string) => {
    dispatch({ type: "DELETE_SET", payload: id });
  };

  const handleDuplicateSet = (id: string) => {
    dispatch({ type: "DUPLICATE_SET", payload: id });
  };

  if (!editingSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No session being edited
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={() => dispatch({ type: "GO_TO_HOME" })}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6 max-w-lg">
      <SectionDividerWithTitle title={"Details"} />
      <Card className={"gap-3 px-4 mb-4"}>
        <LabelWrapper className={"gap-3 pb-6"}>
          <Label htmlFor="sessionName">
            <FolderPen size={16} />
            Name
          </Label>
          <Input
            type="text"
            id="sessionName"
            value={sessionName}
            onChange={handleNameChange}
            placeholder="Enter session name"
          />
        </LabelWrapper>
        <LabelWrapper className={"gap-3 pb-6"}>
          <Label htmlFor="preparationTime">
            <Bath size={16} />
            Preparation Time (seconds)
          </Label>
          <Input
            min={0}
            type="number"
            id="preparationTime"
            value={preparationTime}
            onChange={handlePreparationTimeChange}
          />
        </LabelWrapper>
      </Card>

      {editingSession.sets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No sets added yet
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={handleAddSet}
          >
            Add Your First Set
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <SectionDividerWithTitle title={"Sets"} />
          {editingSession.sets.map((set, index) => (
            <Card key={set.id}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">
                    Set {index + 1}
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                      onClick={() => handleDuplicateSet(set.id)}
                      title="Duplicate set"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
                      onClick={() => handleDeleteSet(set.id)}
                      disabled={editingSession.sets.length === 1}
                      title={
                        editingSession.sets.length === 1
                          ? "Can't delete the only set"
                          : "Delete set"
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`gripType-${set.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Grip Type
                    </label>
                    <input
                      type="text"
                      id={`gripType-${set.id}`}
                      value={set.gripType}
                      maxLength={39}
                      onChange={(e) =>
                        handleSetChange(set.id, "gripType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <TimeSecondsInput
                      id={`hangTime-${set.id}`}
                      label={"Hang Time (seconds)"}
                      value={set.hangTime}
                      min={1}
                      max={60}
                      onChange={(value) =>
                        handleSetChange(set.id, "hangTime", value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`rest-${set.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Rest (seconds)
                    </label>
                    <input
                      type="number"
                      id={`rest-${set.id}`}
                      value={set.rest}
                      min="1"
                      onChange={(e) =>
                        handleSetChange(
                          set.id,
                          "rest",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`repetitions-${set.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Repetitions
                    </label>
                    <input
                      type="number"
                      id={`repetitions-${set.id}`}
                      value={set.repetitions}
                      min="1"
                      max="20"
                      onChange={(e) =>
                        handleSetChange(
                          set.id,
                          "repetitions",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`restAfter-${set.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Rest After Set (seconds)
                    </label>
                    <input
                      type="number"
                      id={`restAfter-${set.id}`}
                      value={set.restAfter}
                      min="0"
                      max="300"
                      onChange={(e) =>
                        handleSetChange(
                          set.id,
                          "restAfter",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`additionalWeight-${set.id}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Additional Weight (kg)
                    </label>
                    <input
                      type="number"
                      id={`additionalWeight-${set.id}`}
                      value={set.additionalWeight}
                      min="0"
                      max="100"
                      onChange={(e) =>
                        handleSetChange(
                          set.id,
                          "additionalWeight",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className={"flex justify-center"}>
            <Button onClick={handleAddSet} variant={"secondary"}>
              <Plus size={16} />
              Add Set
            </Button>
          </div>
        </div>
      )}

      <div className="mt-12 flex space-x-3 justify-end">
        <Button variant={"destructive"} onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save size={18} className="mr-2" />
          Save Session
        </Button>
      </div>
    </div>
  );
};

export default TrainingEditor;
