import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <div className="flex items-center justify-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-3xl mr-2" />
          <h2 className="text-xl font-semibold text-black">Confirmar eliminación</h2>
        </div>
        <p className="text-center mb-6 text-black">{message}</p>
        <div className="flex justify-around items-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
