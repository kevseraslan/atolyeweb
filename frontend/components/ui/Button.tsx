import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded transition-all duration-300 hover-lift tracking-widest uppercase text-xs";

  const variants = {
    primary:
      "bg-[#442a22] text-white hover:bg-[#5d4037] active:bg-[#2c160e] shadow-md",
    secondary:
      "bg-[#e0e0db] text-[#1b1c1c] hover:bg-[#c6c7c2] active:bg-[#b0b1ac]",
    outline:
      "border-2 border-[#442a22] text-[#442a22] hover:bg-[#f0eded] active:bg-[#e5e2e1]",
    ghost: "text-[#504441] hover:text-[#442a22] hover:bg-[#f0eded]",
  };

  const sizes = {
    sm: "px-4 py-2 text-[11px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-xs",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
