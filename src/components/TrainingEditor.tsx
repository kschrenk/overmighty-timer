import React, { useState } from "react";
import { Copy, Plus, Save, Trash2 } from "lucide-react";
import { useTraining } from "../context/TrainingContext";
import { Set } from "../types/training";
import { generateId } from "../utils/timerUtils";

const TrainingEditor: React.FC = () => {
  const { state, dispatch } = useTraining();
  const { editingSession } = state;

  const [sessionName, setSessionName] = useState(editingSession?.name || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(e.target.value);
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
    };

    dispatch({ type: "SAVE_SESSION", payload: updatedSession });
  };

  const handleAddSet = () => {
    const newSet: Set = {
      id: generateId(),
      gripType: "New Grip",
      hangTime: 10,
      repetitions: 3,
      restAfter: 60,
      additionalWeight: 0,
    };

    dispatch({ type: "ADD_SET", payload: newSet });
  };

  const handleCancel = () => {
    if (confirm("Discard changes?")) {
      dispatch({ type: "GO_TO_HOME" });
    }
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
        <p className="text-gray-600 mb-4">No session being edited</p>
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
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <label
          htmlFor="sessionName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Session Name
        </label>
        <input
          type="text"
          id="sessionName"
          value={sessionName}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter session name"
        />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Sets
        </h3>
        <button
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleAddSet}
        >
          <Plus size={16} className="mr-1" />
          Add Set
        </button>
      </div>

      {editingSession.sets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No sets added yet</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={handleAddSet}
          >
            Add Your First Set
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {editingSession.sets.map((set, index) => (
            <div
              key={set.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Set {index + 1}</h4>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => handleDuplicateSet(set.id)}
                    title="Duplicate set"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
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
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Grip Type
                  </label>
                  <input
                    type="text"
                    id={`gripType-${set.id}`}
                    value={set.gripType}
                    onChange={(e) =>
                      handleSetChange(set.id, "gripType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`hangTime-${set.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hang Time (seconds)
                  </label>
                  <input
                    type="number"
                    id={`hangTime-${set.id}`}
                    value={set.hangTime}
                    min="1"
                    max="60"
                    onChange={(e) =>
                      handleSetChange(
                        set.id,
                        "hangTime",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`repetitions-${set.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`restAfter-${set.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`additionalWeight-${set.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex space-x-3">
        <button
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          onClick={handleSave}
        >
          <Save size={18} className="mr-2" />
          Save Session
        </button>
        <button
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TrainingEditor;
