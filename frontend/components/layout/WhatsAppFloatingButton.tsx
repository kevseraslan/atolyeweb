import React from "react";

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <a
      aria-label="WhatsApp ile iletişime geçin"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center hover-lift diffusion-shadow transition-transform"
      href="https://wa.me/905551234567"
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="material-symbols-outlined text-3xl">forum</span>
    </a>
  );
};
