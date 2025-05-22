import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTraining } from "../context/TrainingContext";

const Header: React.FC = () => {
  const { state, dispatch } = useTraining();

  const getTitle = () => {
    switch (state.activeView) {
      case "timer":
        return state.timerData.currentSession?.name || "Training Timer";
      case "editor":
        return state.editingSession?.id
          ? `Edit: ${state.editingSession.name}`
          : "Create New Training";
      default:
        return "Overmighty Timer";
    }
  };

  return (
    <header className="bg-linear-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {state.activeView !== "list" && (
            <button
              className="mr-3 p-1 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
              onClick={() => dispatch({ type: "GO_TO_HOME" })}
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{getTitle()}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
