import type { Meta, StoryObj } from "@storybook/react-vite";
import { SliderInput } from "@/components/SliderInput";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Wrapper component to manage state in stories
const SliderInputWrapper = ({
  initialValue = 30,
  ...props
}: React.ComponentProps<typeof SliderInput> & {
  initialValue?: number;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="p-6 space-y-4">
      <SliderInput {...props} value={value} onChange={setValue} />
      <div className="text-sm text-muted-foreground">
        Current value: {value}s
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue(0)}>
          Reset to 0
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(props.max || 600)}
        >
          Set to Max
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setValue(
              Math.floor(
                Math.random() * ((props.max || 600) - (props.min || 0)) +
                  (props.min || 0),
              ),
            )
          }
        >
          Random Value
        </Button>
      </div>
    </div>
  );
};

const meta: Meta<typeof SliderInputWrapper> = {
  title: "Components/SliderInput",
  component: SliderInputWrapper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A mobile-friendly slider input with fine controls and debounced onChange. Opens a drawer on mobile devices for better interaction.",
      },
    },
  },
  args: {
    initialValue: 30,
    min: 0,
    max: 600,
    step: 1,
    label: "Duration",
    disabled: false,
    debounceMs: 200,
    unitSuffix: "s",
    showMobileFineControls: true,
    mobileFineStep: 1,
    mobileImmediateCommit: true,
  },
  argTypes: {
    initialValue: {
      control: { type: "number" },
      description:
        "Initial value for the story (not a prop of the actual component)",
    },
    value: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    min: {
      control: { type: "number", min: 0, max: 100 },
      description: "Minimum value",
    },
    max: {
      control: { type: "number", min: 100, max: 3600 },
      description: "Maximum value",
    },
    step: {
      control: { type: "number", min: 1, max: 10 },
      description: "Step size for slider",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    disabled: {
      control: "boolean",
      description: "Disable the input",
    },
    debounceMs: {
      control: { type: "number", min: 0, max: 1000 },
      description: "Debounce delay in milliseconds",
    },
    unitSuffix: {
      control: "text",
      description: "Unit suffix (e.g., 's', 'min', 'kg')",
    },
    showMobileFineControls: {
      control: "boolean",
      description: "Show fine controls on mobile",
    },
    mobileFineStep: {
      control: { type: "number", min: 1, max: 10 },
      description: "Step size for mobile fine controls",
    },
    mobileImmediateCommit: {
      control: "boolean",
      description: "Commit mobile fine control changes immediately",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SliderInputWrapper>;

export const Default: Story = {};

export const HangTime: Story = {
  args: {
    initialValue: 7,
    min: 1,
    max: 60,
    step: 1,
    label: "Hang Duration",
    unitSuffix: "s",
    mobileFineStep: 1,
  },
};

export const RestTime: Story = {
  args: {
    initialValue: 180,
    min: 30,
    max: 600,
    step: 5,
    label: "Rest Between Sets",
    unitSuffix: "s",
    mobileFineStep: 5,
  },
};

export const Weight: Story = {
  args: {
    initialValue: 10,
    min: -50,
    max: 100,
    step: 0.5,
    label: "Additional Weight",
    unitSuffix: "kg",
    mobileFineStep: 0.5,
    debounceMs: 100,
  },
};

export const LargeRange: Story = {
  args: {
    initialValue: 300,
    min: 0,
    max: 3600,
    step: 10,
    label: "Total Session Duration",
    unitSuffix: "s",
    mobileFineStep: 10,
  },
};

export const Disabled: Story = {
  args: {
    initialValue: 45,
    disabled: true,
    label: "Disabled Input",
  },
};

export const NoMobileFineControls: Story = {
  args: {
    initialValue: 30,
    showMobileFineControls: false,
    label: "Simple Slider (No Fine Controls)",
  },
};

export const FastDebounce: Story = {
  args: {
    initialValue: 30,
    debounceMs: 50,
    label: "Fast Response (50ms debounce)",
  },
};

export const SlowDebounce: Story = {
  args: {
    initialValue: 30,
    debounceMs: 1000,
    label: "Slow Response (1000ms debounce)",
  },
};

export const WithCustomLabel: Story = {
  args: {
    initialValue: 15,
    min: 5,
    max: 30,
    labelNode: (
      <div className="flex items-center gap-2">
        <span>🏋️</span>
        <span>Exercise Duration</span>
        <span className="text-xs text-muted-foreground">
          (recommended: 10-20s)
        </span>
      </div>
    ),
    unitSuffix: "s",
  },
};
