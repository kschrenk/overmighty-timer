import type { FC } from "react";
import { CircleUser } from "lucide-react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { removeSearchParameters } from "@/lib/removeSearchParameters";
import { useAuth } from "@/context/AuthContext";
import { isUidTestUser } from "@/lib/testUser";
import { HeaderTitle } from "@/components/HeaderTitle";

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
        <HeaderTitle
          title={getTitle()}
          showBackButton={activeView !== "list"}
          onBack={handleGoBack}
        />
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
