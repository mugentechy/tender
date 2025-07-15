import React from "react";

const Confirmation = ({ message, onConfirm, onCancel, confirmButtonClass }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p>{message}</p>
        <div className="mt-4 space-x-4">
          <button
            onClick={onConfirm}
            className={`py-2 px-4 rounded-lg ${
              confirmButtonClass || "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
