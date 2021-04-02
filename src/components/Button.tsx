import React from "react";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className = "", children, ...props }) => {
  return (
    <button
      className={`transition-colors duration-150 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
