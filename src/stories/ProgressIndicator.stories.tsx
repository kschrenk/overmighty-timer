import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressIndicatorCircle } from "@/components/TrainingTimerProgressIndicator";

const meta = {
  title: "ProgressIndicatorCircle",
  component: ProgressIndicatorCircle,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    pathColor: {
      control: { type: "select" },
      options: ["var(--color-red-700)", "var(--color-green-700)"],
    },
  },
  decorators: [
    (Story) => (
      <div className={"px-4"}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressIndicatorCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Circle: Story = {
  args: {
    progress: 60,
    secondsLeft: "00:30",
    pathColor: "var(--color-red-700)",
    description: "Some description",
    textColor: "var(--color-background)",
  },
};
