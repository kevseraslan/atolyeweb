import React from "react";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f3f2] text-[#1b1c1c] font-sans antialiased">
      {children}
    </div>
  );
}
