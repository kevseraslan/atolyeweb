import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "tertiary" | "secondary";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary: "bg-[#5d4037] text-[#ffdbd0]",
    tertiary: "bg-[#233600]/10 text-[#394d14]",
    secondary: "bg-[#e0e0db] text-[#5d5f5b]",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase backdrop-blur-sm ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
