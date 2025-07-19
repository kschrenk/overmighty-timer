import { Slide, Slider } from "../components/ui/slider";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <Slide>
          <div className="h-96 bg-blue-500 flex items-center justify-center">
            Slide 1
          </div>
        </Slide>
        <Slide>
          <div className="h-96 bg-green-500 flex items-center justify-center">
            Slide 2
          </div>
        </Slide>
        <Slide>
          <div className="h-96 bg-red-500 flex items-center justify-center">
            Slide 3
          </div>
        </Slide>
      </>
    ),
  },
};
