import {
  TrainingProvider,
  useTraining,
} from "./context/TrainingContext/TrainingContext";
import Header from "./components/Header";
import TrainingList from "./components/TrainingList";
import TrainingTimer from "./components/TrainingTimer";
import TrainingEditor from "./components/TrainingEditor";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthForm from "./components/form/AuthForm";
import { ThemeProvider } from "./context/ThemeProvider/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Account } from "@/components/Account";
import { RegisterForm } from "@/components/form/RegisterForm";
import { RegisterUserListener } from "@/components/RegisterUserListener";
import { isUidTestUser } from "@/lib/testUser";
import { Button } from "./components/ui/button";
import type { FC } from "react";

const AppContent: FC = () => {
  const { state } = useTraining();
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="grow">
        {isUidTestUser(currentUser?.uid) && (
          <div className={"bg-yellow-100 text-yellow-800 p-2"}>
            <div className={"max-w-sm"}>
              <p className={"inline"}>
                You are using the app as a Test User. Your data will not be
                saved.
              </p>
              <Button
                onClick={logout}
                className={"font-bold"}
                variant={"ghost"}
              >
                Login
              </Button>
            </div>
          </div>
        )}
        {currentUser ? (
          <>
            {state.activeView === "list" && <TrainingList />}
            {state.activeView === "timer" && <TrainingTimer />}
            {state.activeView === "editor" && <TrainingEditor />}
            {state.activeView === "account" && <Account />}
          </>
        ) : state.activeView === "register" ? (
          <RegisterForm />
        ) : (
          <AuthForm />
        )}
      </main>
      <RegisterUserListener />
      <Toaster />
      <footer className="py-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p>Overmighty Timer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TrainingProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AppContent />
        </ThemeProvider>
      </TrainingProvider>
    </AuthProvider>
  );
}

export default App;
