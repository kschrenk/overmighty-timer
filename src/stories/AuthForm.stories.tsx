import type { Meta, StoryObj } from "@storybook/react-vite";
import type { AuthFormValues } from "@/components/form/AuthForm.display";
import AuthFormDisplay from "@/components/form/AuthForm.display";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { authFormSchema } from "@/components/form/AuthForm.constants";

const meta: Meta<typeof AuthFormDisplay> = {
  component: AuthFormDisplay,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof AuthFormDisplay>;

export const Default: Story = {
  render: (args) => {
    const form = useForm<AuthFormValues>({
      resolver: zodResolver(authFormSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <AuthFormDisplay
        {...args}
        form={form}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        onSubmit={(data) => console.log("onSubmit", data)}
        loginAsTestUser={() => console.log("loginAsTestUser")}
        onForgotPassword={() => console.log("onForgotPassword")}
      />
    );
  },
  args: {
    authError: null,
  },
};
