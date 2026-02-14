import {
  SnapItem,
  SnapScrollContainer,
} from "@/components/ui/snapScrollContainer";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: SnapScrollContainer,
} satisfies Meta<typeof SnapScrollContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <SnapItem>
          <div className="h-96 bg-blue-500 flex items-center justify-center">
            Slide 1
          </div>
        </SnapItem>
        <SnapItem>
          <div className="h-96 bg-green-500 flex items-center justify-center">
            Slide 2
          </div>
        </SnapItem>
        <SnapItem>
          <div className="h-96 bg-red-500 flex items-center justify-center">
            Slide 3
          </div>
        </SnapItem>
      </>
    ),
  },
};
