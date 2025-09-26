import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegisterForm } from "@/components/form/RegisterForm";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import { TrainingContext } from "@/context/TrainingContext/TrainingContext";
import type { TrainingContextState } from "@/context/TrainingContext/TrainingContext";
import { initialTimerData } from "@/data/defaultData";
import { Toaster } from "@/components/ui/sonner";

// Minimal mock of the training state used by the RegisterForm (only dispatch is called there)
const mockTrainingState: TrainingContextState = {
  trainingSessions: [],
  timerData: initialTimerData,
  activeView: "register",
  editingSession: null,
};

const meta: Meta<typeof RegisterForm> = {
  title: "Components/RegisterForm",
  component: RegisterForm,
  decorators: [
    (Story) => {
      return (
        <AuthContext.Provider
          value={{
            currentUser: null,
            login: async () => {},
            signup: async () => {
              // simulate network delay
              await new Promise((r) => setTimeout(r, 500));
            },
            logout: async () => {},
            loginAsTestUser: () => {},
          }}
        >
          <TrainingContext.Provider
            value={{
              state: mockTrainingState,
              dispatch: (action) => {
                console.log("TrainingContext dispatch", action);
              },
              loading: false,
              getSessionById: () => undefined,
            }}
          >
            <div className={"dark text-foreground"}>
              <Story />
              <Toaster />
            </div>
          </TrainingContext.Provider>
        </AuthContext.Provider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof RegisterForm>;

export const Default: Story = {};
