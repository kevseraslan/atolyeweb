import React from "react";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber,
}) => {
  const href = phoneNumber
    ? `https://wa.me/${phoneNumber}`
    : "#";

  return (
    <a
      aria-label="WhatsApp Destek Hat"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center hover-lift diffusion-shadow transition-transform"
      href={href}
      target={phoneNumber ? "_blank" : "_self"}
      rel="noopener noreferrer"
    >
      <svg
        className="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.01L0 24l6.17-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 22a9.92 9.92 0 01-5.06-1.39l-.36-.22-3.76.99 1-3.66-.24-.38A9.92 9.92 0 012 12c0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 10-10 10zm5.47-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17 0-.37-.01-.57-.01-.2 0-.53.07-.8.37-.27.3-1.03 1.01-1.03 2.46s1.05 2.85 1.2 3.05c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.11.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
};
