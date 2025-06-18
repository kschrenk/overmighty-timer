import type { FC } from "react";
import { ArrowLeft, CircleUser } from "lucide-react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { removeSearchParameters } from "@/lib/removeSearchParameters";
import { useAuth } from "@/context/AuthContext";
import { isUidTestUser } from "@/lib/testUser";
import { OvermightyText } from "@/components/OvermightyText";

const Header: FC = () => {
  const { state, dispatch } = useTraining();
  const { currentUser } = useAuth();
  const { activeView } = state;

  const getTitle = () => {
    switch (activeView) {
      case "editor":
        return state.editingSession?.id
          ? `Edit: ${state.editingSession.name}`
          : "Create New Training";
      case "account":
        return "My Account";
      default:
        return "Overmighty Timer";
    }
  };

  const handleGoBack = () => {
    if (activeView === "register") {
      // Remove all search parameters from the URL
      removeSearchParameters();
    }
    dispatch({ type: "GO_TO_HOME" });
  };

  if (activeView === "timer") {
    return null;
  }

  return (
    <header className="bg-linear-to-r from-blue-600 to-blue-800 dark:from-gray-950 dark:to-gray-900 text-white p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {activeView !== "list" && (
            <button
              className="mr-3 p-1 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
              onClick={handleGoBack}
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            <OvermightyText>{getTitle()}</OvermightyText>
          </h1>
        </div>
        {currentUser &&
        !isUidTestUser(currentUser.uid) &&
        ["list", "account"].includes(activeView) ? (
          <CircleUser
            onClick={() => dispatch({ type: "GO_TO_ACCOUNT" })}
            color={
              activeView === "account"
                ? "var(--color-blue-500)"
                : "var(--color-gray-300)"
            }
          />
        ) : null}
      </div>
    </header>
  );
};

export default Header;
