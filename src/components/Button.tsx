import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
