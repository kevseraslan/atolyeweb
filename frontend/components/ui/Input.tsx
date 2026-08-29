import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#504441] uppercase tracking-widest mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-transparent border-0 border-b-2 border-[#d4c3be] focus:border-[#442a22] focus:ring-0 py-3 text-base text-[#1b1c1c] transition-colors placeholder:text-[#827470] ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
