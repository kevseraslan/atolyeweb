import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#504441] uppercase tracking-widest mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-[#f6f3f2] border border-[#d4c3be] rounded p-4 text-base text-[#1b1c1c] focus:border-[#442a22] focus:ring-1 focus:ring-[#442a22] transition-colors ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
