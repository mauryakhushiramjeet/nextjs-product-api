// components/ConfirmPopup.tsx
"use client";
import React from "react";

interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w- text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-red-700"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
