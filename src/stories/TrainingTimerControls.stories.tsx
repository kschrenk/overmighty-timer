import { TrainingTimerControls } from "@/components/TrainingTimerControls";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "TrainingTimerControls",
  component: TrainingTimerControls,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isRunning: true,
    isPaused: false,
    isFinished: false,
    isIdle: false,
    handleStart: () => console.log("Start"),
    handlePause: () => console.log("Pause"),
    handleResume: () => console.log("Resume"),
    handleStop: () => console.log("Stop"),
  },
  decorators: [
    (Story) => (
      <div className={"max-w-md pt-12 px-4 mx-auto"}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TrainingTimerControls>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
};
