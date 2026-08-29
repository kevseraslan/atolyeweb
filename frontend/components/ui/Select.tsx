import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, children, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#504441] uppercase tracking-widest mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-transparent border-0 border-b-2 border-[#d4c3be] focus:border-[#442a22] focus:ring-0 py-3 text-base text-[#1b1c1c] cursor-pointer transition-colors ${className}`}
          {...props}
        >
          {children
            ? children
            : options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
