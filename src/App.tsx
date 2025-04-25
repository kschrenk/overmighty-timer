import React from "react";
import { TrainingProvider, useTraining } from "./context/TrainingContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import TrainingList from "./components/TrainingList";
import TrainingTimer from "./components/TrainingTimer";
import TrainingEditor from "./components/TrainingEditor";

const AppContent: React.FC = () => {
  const { state } = useTraining();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="flex-grow">
        {state.activeView === "list" && <TrainingList />}
        {state.activeView === "timer" && <TrainingTimer />}
        {state.activeView === "editor" && <TrainingEditor />}
      </main>
      <footer className="py-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p>Overmighty Timer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <TrainingProvider>
        <AppContent />
      </TrainingProvider>
    </ThemeProvider>
  );
}

export default App;
