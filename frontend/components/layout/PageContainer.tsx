import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full max-w-[1280px] mx-auto px-5 md:px-16 ${className}`}
    >
      {children}
    </div>
  );
};
