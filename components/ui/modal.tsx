import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, className }) => {
  // Only modal scrolls, background remains visible and scrollable
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] p-6 relative overflow-y-auto ${className || ''}`}
        style={{ minHeight: '320px', minWidth: '320px' }}
      >
        {title && <h2 className="text-lg font-semibold mb-4 text-center w-full">{title}</h2>}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
