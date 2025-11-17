import "../src/index.css";
import type { Preview } from "@storybook/react-vite";
import "react-circular-progressbar/dist/styles.css";
import { useEffect } from "react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        // 👇 Default options
        dark: { name: "Dark", value: "#333" },
        light: { name: "Light", value: "#F7F9F2" },
        // 👇 Add your own
        maroon: { name: "Maroon", value: "oklch(21% 0.034 264.665)" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    // 👇 Set the initial background color
    backgrounds: { value: "dark" },
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        document.body.classList.add("dark");
        return () => {
          document.body.classList.remove("dark");
        };
      }, []);
      return <Story />;
    },
  ],
};

export default preview;
