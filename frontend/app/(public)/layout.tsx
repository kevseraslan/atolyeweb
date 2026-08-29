import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
