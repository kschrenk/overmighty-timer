import { TrainingTimerInfo } from "@/components/TrainingTimerInfo/TrainingTimerInfo";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimerState } from "@/types/training";
import { TrainingTimerInfoWrapper } from "@/components/TrainingTimerInfo/TrainingTimerInfoWrapper";

type Props = React.ComponentProps<typeof TrainingTimerInfo>;

interface ExtendedProps extends Props {
  timerState: TimerState;
  isDisplayNextSetInformation: boolean;
  isTimerViewBar?: boolean;
}

const meta = {
  title: "TrainingTimerInfo",
  component: TrainingTimerInfo,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    gripType: "Full Crimped",
    setLength: 4,
    currentSetIndex: 1,
    additionalWeight: 5,
    repetitions: 3,
    currentRepetition: 1,
    timerState: TimerState.HANGING,
    isDisplayNextSetInformation: false,
  },
  argTypes: {
    timerState: {
      control: { type: "select" },
      options: Object.values(TimerState),
    },
    isDisplayNextSetInformation: {
      control: { type: "boolean" },
      description: "Display next set information",
    },
    isTimerViewBar: {
      control: { type: "boolean" },
      description: "Display in timer view bar style",
    },
  },
  render: (args) => {
    return (
      <div className={"dark max-w-md pt-12 px-4 mx-auto"}>
        <TrainingTimerInfoWrapper
          isDisplayNextSetInformation={args.isDisplayNextSetInformation}
          timerState={args.timerState}
          isTimerViewBar={args.isTimerViewBar}
        >
          <TrainingTimerInfo {...args} />
        </TrainingTimerInfoWrapper>
      </div>
    );
  },
} satisfies Meta<ExtendedProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hanging: Story = {};
