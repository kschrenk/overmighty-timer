import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeSecondsInput } from "@/components/TimeSecondsInput";

// Stateful wrapper for controlled component behavior in stories
const Stateful = (args: React.ComponentProps<typeof TimeSecondsInput>) => {
  const [val, setVal] = React.useState(args.value);
  return <TimeSecondsInput {...args} value={val} onChange={setVal} />;
};

const meta = {
  title: "TimeSecondsInput",
  component: TimeSecondsInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Slider-only seconds selector. The input field is read-only (no mobile keyboard) and opens a drawer containing a debounced range slider to update the value.",
      },
    },
  },
  args: {
    onChange: () => {},
    debounceMs: 200,
  },
  argTypes: {
    onChange: { control: false, table: { disable: true } },
    debounceMs: {
      control: { type: "number" },
      description: "Delay in ms for debouncing slider change events",
    },
  },
  decorators: [
    (Story) => (
      <div className={"dark"}>
        <div className="w-[280px] p-4 bg-background text-foreground border rounded-md shadow-sm">
          <Story />
        </div>
      </div>
    ),
  ],
  render: (args) => <Stateful {...args} />,
} satisfies Meta<typeof TimeSecondsInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "seconds-default",
    label: "Seconds",
    value: 30,
    min: 0,
    max: 120,
    step: 1,
  },
};

export const Disabled: Story = {
  args: {
    id: "seconds-disabled",
    label: "Disabled",
    value: 45,
    disabled: true,
    min: 0,
    max: 120,
  },
};

export const ExtendedRange: Story = {
  args: {
    id: "seconds-extended",
    label: "Rest After Set (s)",
    value: 90,
    min: 0,
    max: 600,
    step: 5,
  },
};

export const NoLabel: Story = {
  args: {
    id: "seconds-nolabel",
    value: 10,
    min: 0,
    max: 60,
  },
};
